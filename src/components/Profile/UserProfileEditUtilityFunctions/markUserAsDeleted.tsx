import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import { db } from '../../FirebaseAuthComponents/config/firebase.database';

export const markUserAsDeleted = async (userId: string): Promise<void> => {
  if (!userId) {
    toast.warn("User ID is required.");
    throw new Error("User ID is required.");
  }

  try {
    // Reference to the user document
    const userRef = db.collection('users').doc(userId);

    // Update the user document to mark as deleted
    await userRef.update({ isDeleted: true });

    toast.success("User marked as deleted.");
  } catch (error) {
    console.error("Error in marking user as deleted:", error);
    toast.error("An error occurred while marking the user as deleted.");
  }
};
