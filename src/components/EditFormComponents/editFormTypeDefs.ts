import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export type TimeObject = {
  time?: firebase.firestore.Timestamp | null;
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

export type ItineraryItem = {
    creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
    lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
    isDeleted?: boolean;
    itemTitle?: string;
    startTime?: {time?: Dayjs | null} ;
    endTime?: {time?: Dayjs | null} ;
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

  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };
  
  export type UserAccess = {
    creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
    isDeleted?: boolean;
    uid: string;
    email?: string;
    username?: string;
    itineraryId: string;
    creatorId?: string;
    profilePictureUrl?: string;
    title?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    galleryPhotoUrl?: string;
    role: 'editor' | 'viewer' | 'delete';
    visibility: 'private' | 'shared' | 'public';
  };

  export type ItineraryAccess = UserAccessWithDocId[];

  export type UserAccessWithDocId = UserAccess & {
    docId?: string;
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

export type UnixTimeObject = {
  time?: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

export type IndexDBItineraryItem   = {
  creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  isDeleted?: boolean;
  itemTitle?: string;
  startTime?: UnixTimeObject;
  endTime?: UnixTimeObject;
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

export type IndexDBItinerary = {
  creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  derivedFromItineraryId?: string,
  id?: string;
  uid?: string,
  profilePictureUrl?: string;
  isDeleted?: boolean;
  settings?: ItinerarySettings;
  items?: IndexDBItineraryItem[];
}

export type AlgoliaUser = {
  objectID: string;
  email?: string;
  username?: string;
  profilePictureUrl?: string;
  [key: string]: any;
}

export type UpdateItineraryAccessProps = {
  creationTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
	lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date | firebase.firestore.FieldValue;
  itineraryId: string;
  creatorId?: string;
  title?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  galleryPhotoUrl?: string;
  visibility: 'private' | 'shared' | 'public';
}
