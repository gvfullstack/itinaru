import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import { db } from '../../FirebaseAuthComponents/config/firebase.database';

const MAX_BATCH_SIZE = 500;

export const bulkMarkUserAccessAsDeleted = async (userId: string): Promise<void> => {
  if (!userId) {
    toast.warn("User ID is required.");
    throw new Error("User ID is required.");
  }

  // Function to process deletion in batches
  const processDeletion = async (query: firebase.firestore.Query) => {
    let batch = db.batch();
    let operationCount = 0;

    // Function to handle batch creation and execution
    const executeBatchOperations = async (batch: firebase.firestore.WriteBatch) => {
      await batch.commit();
    };

    const snapshot = await query.get();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { isDeleted: true });
      operationCount++;

      if (operationCount >= MAX_BATCH_SIZE) {
        executeBatchOperations(batch);
        batch = db.batch();
        operationCount = 0;
      }
    });

    // Execute any remaining operations in the batch
    if (operationCount > 0) {
      await executeBatchOperations(batch);
    }
  };

  try {
    // Mark records where the user is the creator as deleted
    const createdByUserQuery = db.collection('ItineraryAccess').where('creatorId', '==', userId);
    await processDeletion(createdByUserQuery);

    // Mark records where the user is a contributor as deleted
    const contributedByUserQuery = db.collection('ItineraryAccess').where('uid', '==', userId);
    await processDeletion(contributedByUserQuery);

    toast.success("All relevant user access records marked as deleted.");
  } catch (error) {
    console.error("Error in bulk deletion:", error);
    toast.error("An error occurred during bulk deletion.");
  }
};
