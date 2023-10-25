import { openDB } from 'idb';

  async function initDB() {
    await openDB('itinerariesDatabase', 2, {  // Note the version bump to 2
      upgrade(db, oldVersion) {  // oldVersion parameter added
        // Create object store for itineraries
        if (oldVersion < 1) {
          db.createObjectStore('itineraries');
          db.createObjectStore('userAuthToken');
          db.createObjectStore('myItineraries');
        }
        // Create new object store for sharedItineraries
        if (oldVersion < 2) {
          db.createObjectStore('sharedItineraries');
        }
      },
    });
  }
  

export default initDB;


