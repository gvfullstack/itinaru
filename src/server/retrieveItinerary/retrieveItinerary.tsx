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
        if (itinerary) {
            itinerary.creationTimestamp = convertFirestoreTimestampToDate(itinerary.creationTimestamp);
            itinerary.lastUpdatedTimestamp = convertFirestoreTimestampToDate(itinerary.lastUpdatedTimestamp);
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

function convertFirestoreTimestampToDate(timestamp: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue | string | FirestoreTimestamp | undefined): string {
    if (timestamp === null || timestamp === undefined) {
        return ''; // Return blank for strictly null or undefined values
    }

    if (typeof timestamp === 'object' && '_seconds' in timestamp && '_nanoseconds' in timestamp) {
        // Handles Firestore Timestamp and FirestoreTimestamp interface
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
    } else if (timestamp instanceof Date) {
        // Handles JavaScript Date object
        return timestamp.toISOString();
    } else if (typeof timestamp === 'string') {
        // Handle string (assuming it's already in a correct format)
        return timestamp;
    }

    return ''; // Fallback for any other types that might not be handled
}



