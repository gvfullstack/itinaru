import { SetterOrUpdater } from 'recoil';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Itinerary, TransformedItinerary } from '../editFormTypeDefs';

// Utility function that transforms an itinerary and returns the new transformed object.
export const createPreviousTransformedItinerary = (itinerary: Itinerary): TransformedItinerary => {
    return {
      id: itinerary.id,
      uid: itinerary.uid || "",
      isDeleted: false,
      settings: {
        title: itinerary.settings?.title || "",
        description: itinerary.settings?.description || "",
        city: itinerary.settings?.city || "",
        state: itinerary.settings?.state || "",
        visibility: itinerary.settings?.visibility || "private",
        galleryPhotoUrl: itinerary.settings?.galleryPhotoUrl || "",
        keywords: itinerary.settings?.keywords || '',
      },
      items: (itinerary?.items ?? []).map(item => ({
        ...item,
        descHidden: true,
        startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },
        endTime: item.endTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.endTime.time.toDate()) } : { time: null },
      }))
    };
};
