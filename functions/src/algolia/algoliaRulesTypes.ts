import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };

  export type ItinerarySettings = {
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: string;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    readAccess?: string[];
    editAccess?: string[];
  }

  export type TimeObject = {
    time?: firebase.firestore.Timestamp | null;
  };
  
  export type TransformedItineraryItem = {
    siteName?: string;
    startTime?: TimeObject;
    endTime?: TimeObject;
    description?: string;
    location?: {latitude: number, longitude: number};
    locationAddress?: string;
    rating?: number;
    locationWebsite?: string;
    expectedPerPersonBudget?: string;
    descHidden?: boolean;
    id?: string;
    averageWeatherOnTravelDate?: string;
    activityDuration?: number;
    userDefinedRespectedTime?: boolean;
    activityType?: string;
    itineraryParentId?: string;
    beingEdited?: boolean
  } 

 export type TransformedItinerary = {
    id?: string;
    uid: string,
    settings: ItinerarySettings;
    items: TransformedItineraryItem[];
}

export type UnixTimeObject = {
  time?: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

