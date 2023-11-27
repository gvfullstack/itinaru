// indexedDBOperations.ts
import { openDB } from 'idb';
import { TransformedItinerary } from '../../EditFormComponents/editFormTypeDefs';

export const updateIndexedDB = async (userId: string, itineraries: TransformedItinerary[]) => {
  const db = await openDB('itinerariesDatabase');
  const tx = db.transaction('myItineraries', 'readwrite');
  const store = tx.objectStore('myItineraries');
  await store.put(itineraries, `userItineraries_${userId}`);
  await store.put(false, `indexDBNeedsRefresh_${userId}`);
  await tx.done;
};
