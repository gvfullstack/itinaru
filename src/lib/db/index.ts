import { openDB } from 'idb';

async function initDB() {
  await openDB('itinerariesDatabase', 1, {
    upgrade(db) {
      // Create object store for itineraries
      db.createObjectStore('itineraries');
      db.createObjectStore('userAuthToken');
      db.createObjectStore('myItineraries');
    },
  });
}

export default initDB;
