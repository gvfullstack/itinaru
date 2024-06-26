import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Timestamp } from 'firebase/firestore';


  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };

  export type ItinerarySettings = {
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: number;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    keywords?: string;
  }

  export type TimeObject = {
    time?: firebase.firestore.Timestamp | null;
  };
  
  export type TransformedItineraryItem = {
    creationTimestamp?: firebase.firestore.Timestamp | Date;
    lastUpdatedTimestamp?: firebase.firestore.Timestamp | Date;
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
    creationTimestamp?: TimeObject | Date;
    lastUpdatedTimestamp?: TimeObject | Date;
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


export type AuthenticatedUser = {
  objectID?: string;
  accountCreationDate?: Timestamp;
  isDeleted?: boolean;
  username?: string | null;
  userFirstLastName?: string | null;
  email?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  uid: string | null;
  privacySettings?: PrivacySettings
  isNewUser?: boolean;
};



export type PrivacySettings = {
  username?: boolean;
  userFirstLastName?: boolean;
  email?: boolean;
  bio?: boolean;
  profilePictureUrl?: boolean;
  emailSearchable?: boolean;
};
