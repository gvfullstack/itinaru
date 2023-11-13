import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import additional Firestore methods
import { db } from '../../FirebaseAuthComponents/config/firebase.database';
import { TransformedItineraryItem } from '../../EditFormComponents/editFormTypeDefs';

export const fetchItineraryItems = async (itineraryId: string) => {
  try {
    // Reference to the items subcollection
    const itemsCollectionRef = collection(db, 'itineraries', itineraryId, 'items');
    // Create a query that filters out items marked as deleted
    const q = query(itemsCollectionRef, where('isDeleted', '!=', true));

    // Execute the query
    const itemsSnapshot = await getDocs(q);
    const items = itemsSnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as TransformedItineraryItem[];
  
    items.sort((a, b) => {
      const aTime = a.startTime?.time?.toDate().getTime() || 0;
      const bTime = b.startTime?.time?.toDate().getTime() || 0;
      return aTime - bTime;
    });
    
    return items;
  } catch (error) {
    console.error("Error fetching itinerary items: ", error);
    toast.error("Error fetching itinerary items. Please ensure you are logged in and connected to the internet.");
  }
}
  