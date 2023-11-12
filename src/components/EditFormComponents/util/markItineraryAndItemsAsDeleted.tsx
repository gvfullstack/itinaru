// FirestoreUtilities.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import { AuthenticatedUser } from '../../typeDefs/index'; // This should be the path to your AuthenticatedUser type definition
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';

export const markItineraryAndItemsAsDeleted = async (
    itineraryId: string,
    AuthenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    if (!AuthenticatedUser || !AuthenticatedUser.uid) {
      toast.warn("No authenticated user found.");
      throw new Error("No authenticated user found.");
    }
  
    // Create a new batch instance
    const batch = firebase.firestore().batch();
  
    // Reference to the Itinerary document and mark as deleted
    const itineraryRef = db.collection('itineraries').doc(itineraryId);
    batch.update(itineraryRef, { isDeleted: true });
  
    // Reference to the Itinerary Items subcollection
    const itemsRef = itineraryRef.collection('items');
    
    // Get all items and mark as deleted
    const itemsSnapshot = await itemsRef.get();

    itemsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { isDeleted: true });
    });
  
    // Query for ItineraryAccess documents related to the itinerary
    const accessQuery = db.collection('ItineraryAccess').where('itineraryId', '==', itineraryId);
    
    // Get all accesses and mark as deleted
    const accessSnapshot = await accessQuery.get();
    accessSnapshot.forEach((doc) => {
      batch.update(doc.ref, { isDeleted: true });
    });
  
    // Commit the batch
    await batch.commit();
  };