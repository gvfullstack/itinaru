import dbServer from '../../utils/firebase.admin';
import dayjs, {Dayjs} from 'dayjs';
import {TransformedItineraryItem, TransformedItinerary, Itinerary, ItineraryItem} from './retrieveMyItinerariesTypeDefs';

export async function fetchAllUserItineraries(userId: string): Promise<Itinerary[] | null> {
    try {
      const itinerariesSnapshot = await dbServer.collection('itineraries')
        .where('uid', '==', userId)
        .get();
      
      if (itinerariesSnapshot.empty) {
        console.error('No itineraries found for user');
        return null;
      }
  
      const itineraries: Itinerary[] = [];
  
      itinerariesSnapshot.forEach((doc) => {
        const itineraryData = doc.data() as TransformedItinerary;
        const transformedItems = itineraryData.items.map(transformItineraryItem);
  
        itineraries.push({
          ...itineraryData,
          items: transformedItems,
        });
      });
  
      return itineraries;
    } catch (error) {
      console.error('Error fetching user itineraries:', error);
      return null;
    }
  }

  

  
function transformItineraryItem(item: TransformedItineraryItem): ItineraryItem {
    return {
        ...item,  // spread the rest of the properties
        startTime: item.startTime?.time ? { time: item.startTime.time.toMillis() } : undefined,
        endTime: item.endTime?.time ? { time: item.endTime.time.toMillis() } : undefined

    };
}
