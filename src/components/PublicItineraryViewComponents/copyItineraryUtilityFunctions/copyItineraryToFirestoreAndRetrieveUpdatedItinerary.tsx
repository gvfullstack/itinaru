import { Itinerary } from "../publicItinViewTypeDefs";
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { Timestamp } from 'firebase/firestore';
import {IndexDBItineraryItem} from "../../../components/EditFormComponents/editFormTypeDefs";
import {TransformedItineraryItem} from "../../../components/EditFormComponents/editFormTypeDefs";
import {copyImageAndGetDownloadURL} from "./copyImageAndGetDownloadURL";

export async function copyItineraryToFirestoreAndRetrieveUpdatedItinerary(originalItinerary:Itinerary | undefined, userId:string | undefined ) {
    if(!originalItinerary) {
        console.error("Cannot save empty itinerary.");
        return;
    }

    try {
        console.log("originalItinerary:", originalItinerary);
        const itinerariesRef = db.collection('itineraries');
        const newItineraryId = itinerariesRef.doc().id; // Always generate a new ID
        const itemsRef = itinerariesRef.doc(newItineraryId).collection('items');
        const batch = db.batch();
        const batch2 = db.batch();

        // Create a new itinerary
        const newItineraryData = {
            derivedFromItineraryId: originalItinerary?.derivedFromItineraryId ? originalItinerary?.derivedFromItineraryId :  originalItinerary?.id,
            id: newItineraryId,
            uid: userId || undefined, 
            isDeleted:false,
            settings:{
                ...originalItinerary.settings,
                title: originalItinerary.settings?.title || '', 
                description: originalItinerary.settings?.description || '', 
                city: originalItinerary.settings?.city || '', 
                state: originalItinerary.settings?.state || '', 
                visibility: 'private' as 'private' | 'shared' | 'public'
            }
        };

        if (originalItinerary.settings?.galleryPhotoUrl) {
            const newGalleryPhotoUrl = await copyImageAndGetDownloadURL(originalItinerary.settings.galleryPhotoUrl, newItineraryId, userId);
            if (newGalleryPhotoUrl !== null) {
                newItineraryData.settings.galleryPhotoUrl = newGalleryPhotoUrl;
              }
        }

        const newItineraryRef = itinerariesRef.doc(newItineraryId);
        batch.set(newItineraryRef, newItineraryData);
        await batch.commit();

        console.log("newItineraryData:", newItineraryData);
        // Transform and add each item to the batch
        const transformedItems = originalItinerary?.items?.map((item) => {
            const newItemRef = itemsRef.doc(); // Generate a new document reference for each item
            const transformedItem = {
                ...item,
                id: newItemRef.id, // Use the new ID for each item
                itineraryParentId: newItineraryId,
                startTime: item.startTime?.time
                ? { time: Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },
                endTime: item.endTime?.time 
                ? { time: Timestamp.fromDate(item.endTime.time.toDate()) } : { time: null },
                };
                console.log("transformedItem:", transformedItem)
                batch2.set(newItemRef, transformedItem);

            return transformedItem;
        });
        console.log("Transformed Item for Firestore:", transformedItems);

        // Commit the batch
        await batch2.commit();

        // Transform the items for the front end by converting Firestore Timestamps to UnixTimeObjects
        const transformedItemsForFrontEnd: IndexDBItineraryItem[] = (transformedItems || []).map((item: TransformedItineraryItem) => {
            return {
                ...item,
                startTime: item.startTime?.time
                            ? { time: { seconds: item.startTime.time.seconds, nanoseconds: item.startTime.time.nanoseconds } }
                            : undefined, // Convert Firestore Timestamp to UnixTimeObject
                endTime: item.endTime?.time
                            ? { time: { seconds: item.endTime.time.seconds, nanoseconds: item.endTime.time.nanoseconds } }
                            : undefined, // Convert Firestore Timestamp to UnixTimeObject
            };
        });
        
        // Construct the final object with the transformed items
        const newItineraryAfterAllUpdates = {
            ...newItineraryData,
            items: transformedItemsForFrontEnd,
        };

        console.log("newItineraryAfterAllUpdates:", newItineraryAfterAllUpdates);

        return newItineraryAfterAllUpdates;

    } catch (error) {
        console.error("Error in batchAddCopiedItineraryWithItems:", error);
        // Optionally, rethrow the error or handle it as needed
        throw error;
    }
}