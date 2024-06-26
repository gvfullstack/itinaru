import * as admin from 'firebase-admin';
import { index } from './algoliaConfig';
import { TransformedItinerary, TransformedItineraryItem } from './algoliaRulesTypes'; // Replace 'yourTypesFile' with the actual path to your types file

async function exportDataToAlgolia() {
    const collectionRef = admin.firestore().collection('itineraries');
    try {
        const snapshot = await collectionRef.get();
        const allObjectsPromises = snapshot.docs.map(async (doc: admin.firestore.DocumentSnapshot) => {
            const data = doc.data() as TransformedItinerary;

            // Check for visibility status
            if (data?.settings?.visibility !== 'public') {
                console.log(`Itinerary with ID: ${doc.id} is not public. Skipping Algolia update.`);
                return null;
            }

            // Get sub-collection data
            const items: TransformedItineraryItem[] = [];
            const itemsSnapshot = await doc.ref.collection('items').get();
            itemsSnapshot.forEach(itemDoc => {
                items.push(itemDoc.data() as TransformedItineraryItem);
            });

            // Append items to the main object
            return {
                objectID: doc.id,
                ...data,
                items,
            };
        });

        const objects = await Promise.all(allObjectsPromises);
        const filteredObjects = objects.filter((obj): obj is NonNullable<typeof obj> => obj !== null);
        await index.saveObjects(filteredObjects);
    } catch (error) {
        console.error('Error exporting data to Algolia:', error);
    }
}

exportDataToAlgolia(); // Run the function

