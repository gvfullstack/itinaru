// firestoreQueries.ts
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { TransformedItinerary } from '../../EditFormComponents/editFormTypeDefs';

export const transformItineraryData = (doc: DocumentData): TransformedItinerary => {
  let data = doc.data() as TransformedItinerary;
  if (!data.settings) {
    data.settings = {
      title: "",
      description: "",
      city: "",
      state: "",
      visibility: "private",
    };
  }
  return data;
};

export const setupRealtimeItinerariesListener = (userId: string, 
    callback: (itineraries: TransformedItinerary[]) => void, 
    errorCallback: (error: Error) => void) => {
  return onSnapshot(
    query(collection(db, 'itineraries'), 
        where('uid', '==', userId), 
        where('isDeleted', '!=', true)),
    (snapshot) => {
      const itineraries = snapshot.docs.map(doc => transformItineraryData(doc));
      callback(itineraries);
    }, 
    errorCallback
  );
};
