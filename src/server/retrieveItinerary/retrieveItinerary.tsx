import dbServer from '../../utils/firebase.admin';
import dayjs, {Dayjs} from 'dayjs';
import {TransformedItineraryItem, TransformedItinerary, Itinerary, ItineraryItem} from './retrieveItinTypeRefs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


export async function fetchItineraryFromDatabase(itineraryId: string, userId: string | undefined): Promise<Itinerary | null> {
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
        console.log("SSR Returned Itinerary", itinerary);
        if (itinerary) {
            console.log("Before conversion:", itinerary.creationTimestamp);
            itinerary.creationTimestamp = convertFirestoreTimestampToDate(itinerary.creationTimestamp);
            itinerary.lastUpdatedTimestamp = convertFirestoreTimestampToDate(itinerary.lastUpdatedTimestamp);
            console.log("After conversion:", itinerary.creationTimestamp);

        }
        // Fetch items from the subcollection
        const itemsQuerySnapshot = await dbServer
            .collection('itineraries').doc(itineraryId)
            .collection('items')
            .where('isDeleted', '!=', true)
            .get();
            

        const items = itemsQuerySnapshot.docs
            .map(doc => transformItineraryItem(doc.data() as TransformedItineraryItem));

            items.sort((a, b) => {
              // Assuming startTime is a Timestamp object or null
                const aTime = a.startTime?.time || 0;
                const bTime = b.startTime?.time || 0;
                return aTime - bTime;
            });

            console.log("SSR Returned Itinerary After", {...itinerary,
                items: items})
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
        creationTimestamp : convertFirestoreTimestampToDate(item.creationTimestamp),
        lastUpdatedTimestamp : convertFirestoreTimestampToDate(item.lastUpdatedTimestamp),
        startTime: item.startTime?.time ? { time: item.startTime.time.toMillis() } : undefined,
        endTime: item.endTime?.time ? { time: item.endTime.time.toMillis() } : undefined

    };
}

interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
    toDate(): Date;
}

function convertFirestoreTimestampToDate(timestamp: FirestoreTimestamp | Date): string {
    if ('_seconds' in timestamp && '_nanoseconds' in timestamp) {
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
    } else if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }
    return timestamp; // This case should not happen, but it's here as a fallback
}

