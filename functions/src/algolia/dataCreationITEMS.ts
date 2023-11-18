import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';
import { TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file


export const addItemToIndex = functions.firestore.document('itineraries/{itineraryId}/items/{itemId}')
  .onCreate(async snapshot => {
    const itemData = snapshot.data() as TransformedItineraryItem;
    const itineraryId = snapshot.ref.parent.parent?.id;

    if (!itineraryId) {
      console.log('Missing itinerary ID. Skipping Algolia indexing.');
      return null;
    }

    // Fetch the parent itinerary document
    const itineraryDoc = await snapshot.ref.parent.parent.get();
    const itineraryData = itineraryDoc.data();

    // Check if the itinerary is public and the item is not marked as deleted
    if (itineraryData?.settings?.visibility === 'public' && itemData.isDeleted !== true) {
      const itemObject = {
        objectID: snapshot.id,
        itineraryParentId: itineraryId,
        itemTitle: itemData.itemTitle,
        description: itemData.description,
        locationAddress: itemData.locationAddress,
        // Include other fields as needed
      };

      return index.saveObject(itemObject);
    } else {
      console.log('Itinerary is not public or item is deleted. Skipping Algolia indexing.');
      return null;
    }
  });

