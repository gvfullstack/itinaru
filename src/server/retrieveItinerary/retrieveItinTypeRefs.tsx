import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';

export type ItineraryItem = {
  creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  isDeleted?: boolean;
  itemTitle?: string;
  startTime?: {time?: number | null} ;
  endTime?: {time?: number | null} ;
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
  creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  derivedFromItineraryId?: string,
  id?: string,
  uid: string,
  profilePictureUrl?: string | null;
  isDeleted?: boolean;
  settings?: ItinerarySettings;
  items?: ItineraryItems;
}


  export type TimeObject = {
    time?: firebase.firestore.Timestamp | null;
  };
  
  export type TransformedItineraryItem   = {
    creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
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
    creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
    lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
    derivedFromItineraryId?: string,
    id?: string;
    uid: string,
    profilePictureUrl?: string;
    isDeleted?: boolean;
    settings: ItinerarySettings;
    items: TransformedItineraryItem[];
}
