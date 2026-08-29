import PouchDB from 'pouchdb';
import find from 'pouchdb-find';

PouchDB.plugin(find);

// Database name MUST be identical to content script PouchDB database name
export const DB_NAME = 'MTDataBase';
export const db = new PouchDB(DB_NAME);
