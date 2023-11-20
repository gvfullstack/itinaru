import 'firebase/compat/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { UserAccess, UserAccessWithDocId, ItineraryAccess } from '../../EditFormComponents/editFormTypeDefs';
import { SetterOrUpdater } from 'recoil';


export const fetchSharedItineraries = async (
  uid: string,
) => {
  // Reference to Firestore collection
  try {
    console.log("Fetching itineraries for user: ", uid);
    const q = query(
      collection(db, 'ItineraryAccess'), 
      where('uid', '==', uid),
      where('visibility', '==', 'shared'),
      where('isDeleted', '!=', true)
      );
    // Query for all itineraries shared with the user
    const querySnapshot = await getDocs(q); 

    if (querySnapshot.empty) {
      console.log('No itineraries shared with this user.');
      return;
    }

    const fetchedItineraries: ItineraryAccess = [];
    querySnapshot.forEach((doc) => {
      const userAccessWithDocId: UserAccessWithDocId = {
        ...doc.data() as UserAccess,
        docId: doc.id,
      };
      fetchedItineraries.push(userAccessWithDocId);
    });
    // Update the Recoil state
    return fetchedItineraries;
  } catch (error) {
    console.error("Error fetching shared itineraries: ", error);
  }
};
