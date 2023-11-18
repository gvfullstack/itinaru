import firebase from 'firebase/compat/app';
import { Itinerary, TransformedItinerary } from '../editFormTypeDefs';
import { validateTitle, validateCity, validateState } from '../util/index'

// Utility function that transforms an itinerary and returns a TransformedItinerary object
export function createCurrentTransformedItinerary(itinerary: Itinerary): TransformedItinerary {
    let transformedItinerary: TransformedItinerary = {
        id: itinerary.id,
        uid: itinerary.uid || "",
        isDeleted: itinerary.isDeleted || false,
        settings: {
          title: "",
          description: itinerary.settings?.description || "",
          city: "",
          state: "",
          visibility: itinerary.settings?.visibility || "private",
          galleryPhotoUrl: itinerary.settings?.galleryPhotoUrl || "",
          keywords: itinerary.settings?.keywords || '',
        },
        items: []
      };
    
      // Validate and populate fields...
      if (validateTitle(itinerary?.settings?.title ?? "")) {
        transformedItinerary.settings.title = itinerary?.settings?.title ?? "";
      }
    
      if (validateCity(itinerary?.settings?.city ?? "")) {
        transformedItinerary.settings.city = itinerary?.settings?.city?.toUpperCase() ?? ""; 
      }
    
      if (validateState(itinerary?.settings?.state ?? "")) {
        transformedItinerary.settings.state = itinerary?.settings?.state?.toUpperCase() || "";
      }
      // Map over itinerary items to transform the incompatible types
      transformedItinerary.items = (itinerary?.items ?? []).map(item => ({
        ...item,
        descHidden: true,
        startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },
        endTime: item.endTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.endTime.time.toDate()) } : { time: null },  
      }));

  return transformedItinerary;
}
