import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../../../FirebaseAuthComponents/config/firebase.database';

export const updateUserRoleInFirebase = async (docId: string, newRole: 'editor' | 'viewer' | 'delete') => {
  const docRef = firebase.firestore().collection('ItineraryAccess').doc(docId);
  try {
    if (newRole === 'delete') {
      // Delete the document from Firestore if the role is 'delete'
      await docRef.delete();
      console.log("Document successfully deleted!");
    } else {
      // Otherwise, update the role
      await docRef.update({
        role: newRole
      });
      console.log("Document successfully updated!");
    }
  } catch (error) {
    console.error("Error updating or deleting document: ", error);
  }
};
