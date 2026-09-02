import { db } from "./pouch"


// item: {
//     _id: "video_443322",
//     _rev: "1-8b870cc3725de26a931d2ab455ed8095",
//     videoId: "443322",
//     channelTitle: "Devashish",
//     videoTitle: "React JS Tutorial",
//     description: "A tutorial on React JS.",
//     thumbnailUrl:"https://i.ytimg.com/vi_webp/f7vW3_5H0fE/hqdefault.webp",
//     savedAt:"2023-05-09T12:00:00.000Z",
//     tags:["React","JS","Tutorial"], (not in use right now)
//     notes:"This is a good tutorial for beginners.", (not in use right now)
//     watched:true,
//     starred:true,
//     folder:""
// }

export async function exportLibrary() {
    //fetch all data from the pouchdb
    const data = await db.allDocs({include_docs:true});
    
    //filtering the design doc and mapping to raw docs
    const filteredData = data.rows
    .map((row=>row.doc))  //returns list of doc
    .filter(doc=>doc && doc._id && !doc._id.startsWith('_design/')) //filter the doc list 
    .map(({_rev, ...rest})=>rest) //remove the rev from the docs

    //format the payload to be send
    const payload = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        data: filteredData
    };

    //convert to json    
    const jsonString = JSON.stringify(payload,null,2)
    
    //make blob and trigger download 
    const blob = new Blob([jsonString],{type:'application/json'})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marktube-library-${new Date().toString().replace(/[^a-zA-Z0-9]/g,'_')}.json`;
    a.click();

    //cleanup
    URL.revokeObjectURL(url);
}


export async function importLibrary(file, onProgress) {
    // Goal: Read JSON file
    const text = await file.text();
    const json = JSON.parse(text);
    const incomingDocs = Array.isArray(json) ? json : (json.data || []); 
    
    // Timestamp-Merge with PouchDB 
   const localRes = await db.allDocs({include_docs:true});

   const localMap = new Map();
   localRes.rows.forEach(row => {
    if( row.doc && row.doc.videoId){
        localMap.set(row.doc.videoId,row.doc);
    }
   })
   //Decision Loop (New vs Existing)
   const docsToUpdate =[];

   incomingDocs.forEach(item => { //we check every item doc in incoming doc list 
    const videoId = item.videoId || (item._id ? item._id.replace('video_',''):null); //get videoId from item
    if(!videoId) return; //if no videoId then skip
    const {_rev,...cleanItem} = item; //remove _rev from item
    const existingDoc = localMap.get(videoId); //get existing doc from localMap
    if (!existingDoc) { //if no existing doc then add to docsToUpdate without _rev
        docsToUpdate.push({...cleanItem,_id:`video_${videoId}`,videoId}) //add _id to cleanItem and add it to docsToUpdate as it doesn't exist locally
    } else {
        //Existing video -> Compare Timestamps
        const parseTime = (val) => (typeof val === 'number' ? val : (new Date(val || 0).getTime() || 0));
        const incomingTime = parseTime(item.savedAt || item.addedAt || item.dateAdded); 
        const existingTime = parseTime(existingDoc.savedAt || existingDoc.addedAt || existingDoc.dateAdded); 
        
        if(incomingTime > existingTime){ //incoming is newer
            docsToUpdate.push({...cleanItem, _id: existingDoc._id, _rev: existingDoc._rev});
        }
    } 
   })

   if(docsToUpdate.length > 0 ){
    //split into bulk chunks for speed
    const CHUNK_SIZE = 50;
    const chunks = [];
    for(let i=0; i<docsToUpdate.length; i+=CHUNK_SIZE){
        chunks.push(docsToUpdate.slice(i,i+CHUNK_SIZE));
    }
    
    //Process chunks with progress feedback
    for(let i=0; i<chunks.length; i++){
        const chunk = chunks[i];
        const result = await db.bulkDocs(chunk);
        //progress callback
        if(onProgress){
            const progress = ((i+1)/chunks.length) * 100;
            onProgress(progress);
        }
    }

    //update total count 
    if(onProgress){
        onProgress(100);
    }
   }
   
   // -> Segregate video IDs -> Send to Content Script
   const allDocsRes = await db.allDocs({include_docs:true});
   const allDocsData= allDocsRes.rows.map(r => r.doc).filter(d => d && d.type && d.videoId);

   //grouping into 3 ID arrays
   const mtWatched = allDocsData.filter(d => d.type === 'watched').map(d =>d.videoId);
   const mtImportant = allDocsData.filter(d => d.type === 'important').map(d => d.videoId);
   const mtToWatch = allDocsData.filter(d=> d.type === 'toWatch').map(d=>d.videoId);


   //send message to content script
   window.parent.postMessage({
    type:"MT_SYNC_STORAGE_DATA",
    payload: {mtWatched,mtImportant,mtToWatch}
   },"*") //* means send to all origins 

   return {
    success:true,
    syncedVideoCount: docsToUpdate.length,
    skippedDuplicates: incomingDocs.length - docsToUpdate.length
   }
}
