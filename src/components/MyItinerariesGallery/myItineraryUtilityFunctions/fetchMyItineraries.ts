import { toast } from 'react-toastify';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { TransformedItinerary } from '../myItinerariesTypeDefs';

const fetchUserItineraries = async (userId: string) => {
    try {
      console.log("Fetching itineraries for user: ", userId);
      const q = query(collection(db, 'itineraries'), where('uid', '==', userId));
      const querySnapshot = await getDocs(q); 
      const itineraries: TransformedItinerary[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as TransformedItinerary;  // Cast to Itinerary type
        itineraries.push(data);
      });
      
      return itineraries; // This is an array of itineraries for the user
    } catch (error) {
      console.error("Error fetching itineraries: ", error);
      toast.error("Please ensure you are logged in and connected to the internet.");
    }
  }

  export default fetchUserItineraries;