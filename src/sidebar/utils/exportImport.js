import { db } from "./pouch";

// item schema reference:
// {
//     _id: "video_443322",
//     _rev: "1-8b870cc3725de26a931d2ab455ed8095",
//     videoId: "443322",
//     channelTitle: "Devashish",
//     videoTitle: "React JS Tutorial",
//     description: "A tutorial on React JS.",
//     thumbnailUrl:"https://i.ytimg.com/vi_webp/f7vW3_5H0fE/hqdefault.webp",
//     savedAt:"2023-05-09T12:00:00.000Z",
//     watched:true,
//     starred:true,
//     folder:""
// }

export async function exportLibrary() {
  //fetch all data from PouchDB
  const data = await db.allDocs({ include_docs: true });

  //filtering the design doc and mapping to raw docs
  const filteredData = data.rows
    .map((row) => row.doc)
    .filter((doc) => doc && doc._id && !doc._id.startsWith('_design/'))
    .map(({ _rev, ...rest }) => rest);

  //format the payload to be sent
  const payload = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: filteredData,
  };

  //convert to JSON
  const jsonString = JSON.stringify(payload, null, 2);

  //make blob and trigger download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `marktube-library-${new Date().toString().replace(/[^a-zA-Z0-9]/g, '_')}.json`;
  a.click();

  //cleanup
  URL.revokeObjectURL(url);
}

export async function importLibrary(file, onProgress) {
  const text = await file.text();
  const json = JSON.parse(text);
  const incomingDocs = Array.isArray(json) ? json : json.data || [];

  // Timestamp-Merge with PouchDB
  const localRes = await db.allDocs({ include_docs: true });

  const localMap = new Map();
  localRes.rows.forEach((row) => {
    if (row.doc && row.doc.videoId) {
      localMap.set(row.doc.videoId, row.doc);
    }
  });

  const docsToUpdate = [];

  incomingDocs.forEach((item) => {
    const videoId = item.videoId || (item._id ? item._id.replace('video_', '') : null);
    if (!videoId) return;
    const { _rev, ...cleanItem } = item;
    const existingDoc = localMap.get(videoId);
    if (!existingDoc) {
      docsToUpdate.push({ ...cleanItem, _id: `video_${videoId}`, videoId });
    } else {
      const parseTime = (val) =>
        typeof val === 'number' ? val : new Date(val || 0).getTime() || 0;
      const incomingTime = parseTime(item.savedAt || item.addedAt || item.dateAdded);
      const existingTime = parseTime(existingDoc.savedAt || existingDoc.addedAt || existingDoc.dateAdded);

      if (incomingTime > existingTime) {
        docsToUpdate.push({ ...cleanItem, _id: existingDoc._id, _rev: existingDoc._rev });
      }
    }
  });

  if (docsToUpdate.length > 0) {
    const CHUNK_SIZE = 50;
    const chunks = [];
    for (let i = 0; i < docsToUpdate.length; i += CHUNK_SIZE) {
      chunks.push(docsToUpdate.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      await db.bulkDocs(chunk);
      if (onProgress) {
        const progress = ((i + 1) / chunks.length) * 100;
        onProgress(progress);
      }
    }

    if (onProgress) {
      onProgress(100);
    }
  }

  // Segregate video IDs & Send to Content Script
  const allDocsRes = await db.allDocs({ include_docs: true });
  const allDocsData = allDocsRes.rows.map((r) => r.doc).filter((d) => d && d.type && d.videoId);

  const mtWatched = allDocsData.filter((d) => d.type === 'watched').map((d) => d.videoId);
  const mtImportant = allDocsData.filter((d) => d.type === 'important').map((d) => d.videoId);
  const mtToWatch = allDocsData.filter((d) => d.type === 'toWatch').map((d) => d.videoId);

  window.parent.postMessage(
    {
      type: 'MT_SYNC_STORAGE_DATA',
      payload: { mtWatched, mtImportant, mtToWatch },
    },
    '*'
  );

  return {
    success: true,
    syncedVideoCount: docsToUpdate.length,
    skippedDuplicates: incomingDocs.length - docsToUpdate.length,
  };
}

export async function clearLibraryData() {
  // 1. Fetch all docs from PouchDB
  const allDocs = await db.allDocs({ include_docs: true });

  // 2. Delete all video docs from PouchDB
  const docsToDelete = allDocs.rows
    .map((row) => row.doc)
    .filter((doc) => doc && doc._id && !doc._id.startsWith('_design/'))
    .map((doc) => ({ ...doc, _deleted: true }));

  if (docsToDelete.length > 0) {
    await db.bulkDocs(docsToDelete);
  }

  // 3. Clear chrome.storage.local if accessible
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.clear();
  }

  // 4. Send clear event to content script to wipe video borders on live page
  window.parent.postMessage(
    {
      type: 'MT_SYNC_STORAGE_DATA',
      payload: { mtWatched: [], mtImportant: [], mtToWatch: [] },
    },
    '*'
  );

  return true;
}
