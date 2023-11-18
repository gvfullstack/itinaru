import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';

export const deleteFromIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onDelete(async (snapshot, context) => {
    const itineraryId = context.params.itineraryId;

    // Query Algolia for items associated with this itinerary
    const query = `itineraryParentId:${itineraryId}`;
    const itemsToDelete = await index.search(query)
      .then(response => response.hits.map(hit => hit.objectID));

    // Delete items in a batch
    if (itemsToDelete.length > 0) {
      await index.deleteObjects(itemsToDelete);
    }

    // Finally, delete the itinerary itself
    return index.deleteObject(itineraryId);
  });
