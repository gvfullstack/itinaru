import dbServer from '../../utils/firebase.admin';
import dayjs, {Dayjs} from 'dayjs';
import {TransformedItineraryItem, TransformedItinerary, Itinerary, ItineraryItem} from './retrieveItinTypeRefs';

export async function fetchItineraryFromDatabase(itineraryId: string): Promise<Itinerary | null> {
    try {
        const itineraryDoc = await dbServer.collection('itineraries').doc(itineraryId).get();

        if (!itineraryDoc.exists) {
            console.error('Itinerary not found');
            return null;
        }

        const itinerary = itineraryDoc.data() as TransformedItinerary;


        return {
            ...itinerary,
            items: itinerary.items.map(transformItineraryItem)
        };    
    } 
        catch (error) {
        console.error('Error fetching itinerary:', error);
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
