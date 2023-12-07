import { authUserState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { toast } from 'react-toastify';
import {AuthenticatedUser} from '../../typeDefs/index'


export const createGenericFirestoreItineraryDocAndRetrieveDocRef = async (authUser:
  AuthenticatedUser | null) => {
    
    const itineraryData = {
      id: "",
      uid: authUser?.uid,
      isDeleted: false,
      settings: {
        title: '',
        visibility: "private",
      }
    };
  
    try {
      // Reference to the 'itineraries' collection
      const itinerariesRef = collection(db, 'itineraries');
  
      // Add new itinerary data to Firestore
      const docRef = await addDoc(itinerariesRef, itineraryData);

      itineraryData.id = docRef.id;

  // Update Firestore document with the generated ID
      await updateDoc(docRef, { id: docRef.id });
      toast.success("Itinerary copied successfully!");
    return docRef;

    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error(`Error saving itinerary. ${error}` );
      return null
    }
    
  };