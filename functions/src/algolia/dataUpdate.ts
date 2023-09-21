import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';

export const updateIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onUpdate(async change => {
    const newData = change.after.data();
    
    // Get items sub-collection
    const items: any[] = [];
    const itemsSnapshot = await change.after.ref.collection('items').get();
    itemsSnapshot.forEach(itemDoc => {
      items.push(itemDoc.data());
    });

    const object = {
      objectID: change.after.id,
      ...newData,
      items,
    };
    
    return index.saveObject(object);
  });

