import {IndexDBItinerary} from '../../../components/EditFormComponents/editFormTypeDefs'
import {AuthenticatedUser} from '../../../components/typeDefs/index'
import { openDB } from 'idb';

function isEmptyObject(obj:IndexDBItinerary) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  
export const updateIndexedDB = async (convertedItinerary: IndexDBItinerary, authUser:AuthenticatedUser | null) => {
    if (isEmptyObject(convertedItinerary)) {
        console.error("Cannot save empty itinerary.");
        return;
      }
    
     console.log("Before openDB");
      const indexDB = await openDB('itinerariesDatabase');
      const tx = indexDB.transaction('itineraries', 'readwrite');
      const store = tx.objectStore('itineraries');
      await store.put(convertedItinerary, `currentlyEditingItineraryStateEF_${authUser?.uid}`);
      console.log("after openDB", store);
      await tx.done;

  };