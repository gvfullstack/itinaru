import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import { TransformedItinerary, TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file

export const updateIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onUpdate(async change => {
    const newData = change.after.data() as TransformedItinerary; // Explicitly set the type here

    // Check if the itinerary is marked as public
    const visibility = newData?.settings?.visibility;
    if (visibility === 'public') {
      // Get items sub-collection
      const items: TransformedItineraryItem[] = []; // Explicitly set the type here
      const itemsSnapshot = await change.after.ref.collection('items').get();
      itemsSnapshot.forEach(itemDoc => {
        items.push(itemDoc.data() as TransformedItineraryItem); // Explicitly set the type here
      });

      const object = {
        objectID: change.after.id,
        ...newData,
        items,
      };
      
      return index.saveObject(object);
    } else {
      // Delete from Algolia index if it's not public
      console.log('Itinerary is not public. Removing from Algolia index.');
      return index.deleteObject(change.after.id);
    }
  });
