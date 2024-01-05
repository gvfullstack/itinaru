import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export type ItineraryItem = {
    itemTitle?: string;
    startTime?: {time?: Dayjs | null};
    endTime?: {time?: Dayjs | null};
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
    isDeleted?: boolean;
  } 

  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };
  
  export type ItineraryItems = ItineraryItem[];

  export type ItinerarySettings = {
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: string;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    keywords?: string;
  }
      
  export type Itinerary = {
    derivedFromItineraryId?: string,
    id?: string;
    uid: string;
    profilePictureUrl?: string;
    isDeleted?: boolean;
    settings: ItinerarySettings;
    items: ItineraryItems;
  }

  export type TimeObject = {
    time?: firebase.firestore.Timestamp | null;
  };
  
  export type TransformedItineraryItem = {
    isDeleted?: boolean;    
    itemTitle?: string;
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
    derivedFromItineraryId?: string,
    id?: string;
    uid: string,
    profilePictureUrl?: string;
    isDeleted?: boolean;
    settings: ItinerarySettings;
    items: TransformedItineraryItem[];
}

export interface AlgoliaHitType {
  objectID: string; // Common in Algolia hits
  derivedFromItineraryId?: string;
  uid?: string;
  profilePictureUrl?: string;
  settings?: ItinerarySettings;
  itineraryParentId?: string;
  itemTitle?: string;
  description?: string;
  locationAddress?: string;
  // ... include other fields as necessary
}