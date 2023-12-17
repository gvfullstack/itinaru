import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import { db } from '../../FirebaseAuthComponents/config/firebase.database';

const MAX_BATCH_SIZE = 500;

export const bulkMarkUserItinerariesAsDeleted = async (userId: string): Promise<void> => {
  if (!userId) {
    toast.warn("User ID is required.");
    throw new Error("User ID is required.");
  }

  try {
    // Function to handle batch creation and execution
    const executeBatchOperations = async (batch: firebase.firestore.WriteBatch) => {
      await batch.commit();
    };

    let batch = db.batch();
    let operationCount = 0;

    // Query for Itineraries
    const itinerariesQuery = db.collection('itineraries').where('uid', '==', userId);
    const itinerariesSnapshot = await itinerariesQuery.get();

    for (const doc of itinerariesSnapshot.docs) {
      // Update the itinerary document
      batch.update(doc.ref, { isDeleted: true });
      operationCount++;

      // Query and update each item in the itinerary's subcollection
      const itemsQuerySnapshot = await doc.ref.collection('items').get();
      for (const itemDoc of itemsQuerySnapshot.docs) {
        batch.update(itemDoc.ref, { isDeleted: true });
        operationCount++;

        // Check if we've reached the batch size limit
        if (operationCount >= MAX_BATCH_SIZE) {
          await executeBatchOperations(batch);
          batch = db.batch(); // Start a new batch
          operationCount = 0;
        }
      }
    }

    // Check and execute remaining operations in the batch
    if (operationCount > 0) {
      await executeBatchOperations(batch);
    }

    toast.success("All itineraries and items marked as deleted.");
  } catch (error) {
    console.error("Error in bulk deletion:", error);
    toast.error("An error occurred during bulk deletion.");
  }
};
