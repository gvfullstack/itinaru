import { toast } from 'react-toastify';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseAuthComponents/config/firebase.database';
import { TransformedItinerary, TransformedItineraryItem } from '../../EditFormComponents/editFormTypeDefs';

export const fetchItineraryAndItems = async (itineraryId: string): Promise<TransformedItinerary | null> => {
  try {
    // Fetch itinerary details
    const itineraryDocRef = doc(db, 'itineraries', itineraryId);
    const itinerarySnapshot = await getDoc(itineraryDocRef);

    if (!itinerarySnapshot.exists()) {
      toast.error('Itinerary not found.');
      return null;
    }

    let itinerary = itinerarySnapshot.data() as TransformedItinerary;
    itinerary.id = itinerarySnapshot.id;

     // Check if the itinerary is marked as deleted
     if (itinerary.isDeleted) {
        toast.error('Itinerary has been deleted.');
        return null;
      }
  
    // Fetch itinerary items
    const itemsCollectionRef = collection(db, 'itineraries', itineraryId, 'items');
    const itemsQuery = query(itemsCollectionRef, where('isDeleted', '!=', true));
    const itemsSnapshot = await getDocs(itemsQuery);

    const items: TransformedItineraryItem[] = itemsSnapshot.docs.map(doc => {
      let item = doc.data() as TransformedItineraryItem;
      item.id = doc.id;
      return item;
    });

    // Sort items by start time
    items.sort((a, b) => {
      const aTime = a.startTime?.time?.toDate().getTime() || 0;
      const bTime = b.startTime?.time?.toDate().getTime() || 0;
      return aTime - bTime;
    });

    // Assign items to the itinerary
    itinerary.items = items;

    return itinerary;
  } catch (error) {
    console.error("Error fetching itinerary and items: ", error);
    toast.error("Error fetching itinerary and items. Please ensure you are logged in and connected to the internet.");
    return null;
  }
}

