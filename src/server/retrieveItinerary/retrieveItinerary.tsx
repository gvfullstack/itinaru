import dbServer from '../../utils/firebase.admin';
import dayjs, {Dayjs} from 'dayjs';
import {TransformedItineraryItem, TransformedItinerary, Itinerary, ItineraryItem} from './retrieveItinTypeRefs';

export async function fetchItineraryFromDatabase(itineraryId: string, userId: string): Promise<Itinerary | null> {
    console.log("fetchItineraryFromDatabase called with ID:", itineraryId);

    try {
        const itineraryDoc = await dbServer.collection('itineraries').doc(itineraryId).get();
        const itineraryData = itineraryDoc.data();

        if (!itineraryDoc.exists || itineraryData?.isDeleted) {
            return null;
        }

        const isOwner = itineraryData?.uid === userId;
        const isPublic = itineraryData?.settings.visibility === 'public';
        const isSharedAccess = itineraryData?.settings.visibility === 'shared' && 
                               (await dbServer.collection('ItineraryAccess').doc(`${userId}_${itineraryId}`).get()).exists;

        if (!(isOwner || isPublic || isSharedAccess)) {
            return null;
        }        

        const itinerary = itineraryDoc.data() as TransformedItinerary;

        // Fetch items from the subcollection
        const itemsQuerySnapshot = await dbServer
            .collection('itineraries').doc(itineraryId)
            .collection('items')
            .where('isDeleted', '!=', true)
            .get();
            
            console.log("Raw items data:", itemsQuerySnapshot.docs.map(doc => doc.data()));

        const items = itemsQuerySnapshot.docs
            .map(doc => transformItineraryItem(doc.data() as TransformedItineraryItem));

            console.log("Items before sorting:", items);

            items.sort((a, b) => {
              // Assuming startTime is a Timestamp object or null
                const aTime = a.startTime?.time || 0;
                const bTime = b.startTime?.time || 0;
                return aTime - bTime;
            });

            console.log("Items after sorting:", items);

        return {
            ...itinerary,
            items: items
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
