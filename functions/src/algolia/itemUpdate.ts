import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import * as admin from 'firebase-admin';
import { TransformedItinerary, TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file

export const itemUpdate = functions.firestore.document('itineraries/{itineraryId}/items/{itemId}')
  .onWrite(async (change, context) => {
    const itineraryId = context.params.itineraryId;

    // Fetch the itinerary document
    const itineraryDoc = await admin.firestore().collection('itineraries').doc(itineraryId).get();

    if (!itineraryDoc.exists) {
      console.error(`Failed to find itinerary with ID: ${itineraryId}`);
      return null;
    }

    const itineraryData = itineraryDoc.data() as TransformedItinerary; // Explicitly set the type here

    // Check for visibility status
    if (itineraryData?.settings?.visibility !== 'public') {
      console.log(`Itinerary with ID: ${itineraryId} is not public. Skipping Algolia update.`);
      return null;
    }

    // Get items sub-collection
    const items: TransformedItineraryItem[] = []; // Explicitly set the type here
    const itemsSnapshot = await itineraryDoc.ref.collection('items').get();
    itemsSnapshot.forEach(itemDoc => {
      items.push(itemDoc.data() as TransformedItineraryItem); // Explicitly set the type here
    });

    const object = {
      objectID: itineraryId,
      ...itineraryData,
      items,
    };

    return index.saveObject(object);
  });
