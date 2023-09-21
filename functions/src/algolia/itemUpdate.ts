import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import * as admin from 'firebase-admin';


export const itemUpdate = functions.firestore.document('itineraries/{itineraryId}/items/{itemId}')
  .onWrite(async (change, context) => {
    const itineraryId = context.params.itineraryId;

    // Fetch the itinerary document
    const itineraryDoc = await admin.firestore().collection('itineraries').doc(itineraryId).get();

    if (!itineraryDoc.exists) {
      console.error(`Failed to find itinerary with ID: ${itineraryId}`);
      return null;
    }

    const itineraryData = itineraryDoc.data();

    // Get items sub-collection
    const items: any[] = [];
    const itemsSnapshot = await itineraryDoc.ref.collection('items').get();
    itemsSnapshot.forEach(itemDoc => {
      items.push(itemDoc.data());
    });

    const object = {
      objectID: itineraryId,
      ...itineraryData,
      items,
    };

    return index.saveObject(object);
  });

