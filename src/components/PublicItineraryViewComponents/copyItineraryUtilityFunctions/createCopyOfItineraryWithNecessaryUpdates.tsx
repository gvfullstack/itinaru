import { DocumentReference } from 'firebase/firestore';
import {IndexDBItinerary} from '../../../components/EditFormComponents/editFormTypeDefs'
import { Itinerary } from '../publicItinViewTypeDefs'; 
import {AuthenticatedUser} from '../../../components/typeDefs/index'

export const createCopyOfItineraryWithNecessaryUpdates = (currentlyViewingItinerary:Itinerary | null, 
  authUser:AuthenticatedUser | null, savedDocRef: DocumentReference | null): IndexDBItinerary | undefined => {
          
      if (!savedDocRef) {
        console.error("Unable to get the saved document reference.");
        return;
      }
    
      const itineraryId = savedDocRef.id;

      let userId;
      if (typeof authUser?.uid !== 'string') {
        throw new Error("UID is not a string or is missing");
      } else {
        userId = authUser?.uid;
      }
  
      const copiedItineraryWithNewId: IndexDBItinerary = currentlyViewingItinerary 
      && typeof currentlyViewingItinerary.id === 'string' ? {
        ...currentlyViewingItinerary,
        id: itineraryId, 
        uid: userId,
        items: currentlyViewingItinerary.items?.map(item => (
          const newItemId = addItemToItinerary(itineraryId) 
          {
            ...item,
            id: newItemId,
            startTime: item.startTime?.time
              ? { time: { seconds: item.startTime.time.unix(), nanoseconds: 0 } }
              : undefined,
            endTime: item.endTime?.time
              ? { time: { seconds: item.endTime.time.unix(), nanoseconds: 0 } }
              : undefined,
        }))
      }  : {}; 

      return copiedItineraryWithNewId;
    };
