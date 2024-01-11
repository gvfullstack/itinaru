import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import { TransformedItinerary } from './algoliaRulesTypes'; // Ensure this path is correct

export const updateIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onUpdate(async (change, context) => {
    console.log('updateIndex triggered for itineraryId:', context.params.itineraryId);
    const newData = change.after.data() as TransformedItinerary;
    console.log('Retrieved Itinerary Data:', newData);

    const visibility = newData?.settings?.visibility;
    const isDeleted = newData?.isDeleted;

    if (visibility === 'public' && isDeleted !== true) {
      const object = {
        objectID: change.after.id,
        ...newData,
      };

      console.log('Updating Algolia Index for:', change.after.id);
      return index.saveObject(object);
    } else {
      console.log('Deleting from Algolia Index:', change.after.id);
      await index.deleteObject(change.after.id);

      // Additional step: Delete all associated items
      try {
        const query = `itineraryParentId:${change.after.id}`;
        // Perform a search for all objects that match the query
        const hits = await index.search('', { filters: query });
        console.log("hits", hits);
        const objectIDs = hits.hits.map(hit => hit.objectID);

        if (objectIDs.length > 0) {
          console.log('Deleting associated items from Algolia Index for:', change.after.id);
          return index.deleteObjects(objectIDs);
        } else {
          console.log('No associated items to delete for:', change.after.id);
          return null;
        }
      } catch (error) {
        console.error('Error deleting associated items:', error);
        throw error; // or handle the error as needed
      }
    }
  });
