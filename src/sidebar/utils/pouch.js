import PouchDB from 'pouchdb';
import find from 'pouchdb-find';

PouchDB.plugin(find);

// One doc per video: { _id: 'video_<id>', videoId, type, title, channel, thumbnail, addedAt }
export const db = new PouchDB('marktube');
