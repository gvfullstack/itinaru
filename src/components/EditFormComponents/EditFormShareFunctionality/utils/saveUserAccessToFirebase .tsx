import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { UserAccess, UserAccessWithDocId } from '../../editFormTypeDefs';
import { SetterOrUpdater } from 'recoil';

export const saveUserAccessToFirebase = async (
  user: UserAccess,
  setItineraryAccessState: SetterOrUpdater<UserAccessWithDocId[]>,
  itineraryId: string,
) => {
  // Remove any properties that are undefined before saving to Firestore
  const cleanedUser = Object.fromEntries(
    Object.entries(user).filter(([_, v]) => v !== undefined)
  );

  // Generate the custom document ID
  const customDocId = `${user.uid}_${itineraryId}`;

  // Reference to the specific document with the custom ID in Firestore collection
  const docRef = firebase.firestore().collection('ItineraryAccess').doc(customDocId);

  try {
    // Check if the document already exists
    const doc = await docRef.get();

    let userWithDocId: UserAccessWithDocId;

    if (doc.exists) {
      console.log('User already exists, retrieving existing data.');
      userWithDocId = {
        ...doc.data() as UserAccess,
        docId: customDocId,
      };
    } else {
      // If not, set the new user with the custom document ID
      await docRef.set(cleanedUser);
      userWithDocId = {
        ...user,
        docId: customDocId,
      };
    }

    // Update the Recoil state
    setItineraryAccessState(prevState => {
      // Ensure we're not duplicating the entry if it already exists
      const index = prevState.findIndex(item => item.docId === customDocId);
      if (index !== -1) {
        // Replace the existing item
        prevState[index] = userWithDocId;
        return [...prevState];
      } else {
        // Add the new item
        return [userWithDocId, ...prevState];
      }
    });

  } catch (error) {
    console.error("Error adding or querying document: ", error);
  }
};
