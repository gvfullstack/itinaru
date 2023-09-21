import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';


export const addToIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onCreate(async snapshot => {
    const data = snapshot.data();
    
    // Get items sub-collection
    const items: any[] = [];
    const itemsSnapshot = await snapshot.ref.collection('items').get();
    itemsSnapshot.forEach(itemDoc => {
      items.push(itemDoc.data());
    });

    const object = {
      objectID: snapshot.id,
      ...data,
      items,
    };
    
    return index.saveObject(object);
  });
