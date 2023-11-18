import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import { TransformedItinerary } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file


export const addToIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onCreate(async snapshot => {
    const data = snapshot.data() as TransformedItinerary;
    
    if (data?.settings?.visibility === 'public' && data?.isDeleted !== true) {
      const object = {
        objectID: snapshot.id,
        ...data,
      };
      
      return index.saveObject(object); // Save only the itinerary data, excluding items
    } else {
      console.log('Itinerary is not public or is deleted. Skipping Algolia indexing.');
      return null;
    }
  });

