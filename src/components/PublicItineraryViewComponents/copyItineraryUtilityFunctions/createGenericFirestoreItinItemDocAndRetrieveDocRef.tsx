
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';

export async function addItemToItinerary(itineraryId:string) {
    try {
      const itemsRef = db.collection('itineraries').doc(itineraryId).collection('items');
      console.log("itemsRef", itemsRef);
  
      const newItem = {
        // Add other fields as necessary
        descHidden: true,
        itineraryParentId: itineraryId,
        isDeleted: false,
      };
  
      const docRef = await itemsRef.add(newItem);
      console.log("New item added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding item to itinerary:", error);
      throw error; // Or handle the error as needed
    }
  }