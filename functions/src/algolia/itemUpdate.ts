import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import {TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file

export const itemUpdate = functions.firestore.document('itineraries/{itineraryId}/items/{itemId}')
  .onWrite(async (change, context) => {
    const { itineraryId, itemId } = context.params;

    // Determine if the document was deleted
    const wasDeleted = !change.after.exists;

    // If deleted, remove the item from Algolia
    if (wasDeleted) {
      return index.deleteObject(itemId);
    }

    // Fetch the specific item document
    const itemDoc = change.after.exists ? change.after : change.before;
    const itemData = itemDoc.data() as TransformedItineraryItem;

    // Check if the item is not marked as deleted
    if (itemData.isDeleted !== true) {
      const itemObject = {
        objectID: itemId,
        itineraryParentId: itineraryId,
        itemTitle: itemData.itemTitle,
        description: itemData.description,
        locationAddress: itemData.locationAddress,
        // Include other fields that you need to index
      };

      return index.saveObject(itemObject);
    } else {
      console.log('Item is deleted or missing itinerary ID. Skipping Algolia indexing.');
      return null;
    }
  });
