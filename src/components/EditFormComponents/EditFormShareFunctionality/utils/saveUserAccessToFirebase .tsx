import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { UserAccess, UserAccessWithDocId } from '../../editFormTypeDefs';
import { SetterOrUpdater } from 'recoil';

export const saveUserAccessToFirebase = async (
  user: UserAccess,
  setItineraryAccessState: SetterOrUpdater<UserAccessWithDocId[]>
) => {
  // Remove any properties that are undefined before saving to Firestore
  const cleanedUser = Object.fromEntries(
    Object.entries(user).filter(([_, v]) => v !== undefined)
  );

  // Reference to Firestore collection
  const collectionRef = firebase.firestore().collection('ItineraryAccess');

  try {
    // Check if the user already exists in the database
    const querySnapshot = await collectionRef
      .where('uid', '==', user.uid)
      .where('itineraryId', '==', user.itineraryId)
      .get();

    let userWithDocId: UserAccessWithDocId;

    if (!querySnapshot.empty) {
      console.log('User already exists, retrieving existing data.');

      const doc = querySnapshot.docs[0];
      userWithDocId = {
        ...doc.data() as UserAccess,
        docId: doc.id,
      };

    } else {
      // If not, add the new user
      const docRef = await collectionRef.add(cleanedUser);
      const docId = docRef.id;

      // Create a new object with the document ID and spread the rest of the user fields
      userWithDocId = {
        ...user,
        docId: docId,
      };
    }

    // Update the Recoil state
    setItineraryAccessState(prevState => [userWithDocId, ...prevState]);

  } catch (error) {
    console.error("Error adding or querying document: ", error);
  }
};
