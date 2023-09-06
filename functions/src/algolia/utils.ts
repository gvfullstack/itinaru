import * as admin from 'firebase-admin';
import { index } from './algoliaConfig';

async function exportDataToAlgolia() {
    const collectionRef = admin.firestore().collection('itineraries');
    try {
        const snapshot = await collectionRef.get();
        const allObjectsPromises = snapshot.docs.map(async (doc: admin.firestore.DocumentSnapshot) => {
            const data = doc.data();
            
            // Get sub-collection data
            const items: any[] = [];
            const itemsSnapshot = await doc.ref.collection('items').get();
            itemsSnapshot.forEach(itemDoc => {
                items.push(itemDoc.data());
            });

            // Append items to the main object
            return {
                objectID: doc.id,
                ...data,
                items,
            };
        });

        const objects = await Promise.all(allObjectsPromises);
        await index.saveObjects(objects);
    } catch (error) {
        console.error('Error exporting data to Algolia:', error);
    }
}

exportDataToAlgolia(); // Run the function

