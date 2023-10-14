import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import { TransformedItinerary, TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file


export const addToIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onCreate(async snapshot => {
    const data = snapshot.data() as TransformedItinerary; // Explicitly set the type here
    
    // Check if the itinerary is marked as public
    const visibility = data?.settings?.visibility;
    if (visibility === 'public') {
      // Get items sub-collection
      const items: TransformedItineraryItem[] = []; // Explicitly set the type here
      const itemsSnapshot = await snapshot.ref.collection('items').get();
      itemsSnapshot.forEach(itemDoc => {
        items.push(itemDoc.data() as TransformedItineraryItem); // Explicitly set the type here
      });

      const object = {
        objectID: snapshot.id,
        ...data,
        items,
      };
      
      return index.saveObject(object);
    } else {
      // Skip if the itinerary is not public
      console.log('Itinerary is not public. Skipping Algolia indexing.');
      return null;
    }
  });
