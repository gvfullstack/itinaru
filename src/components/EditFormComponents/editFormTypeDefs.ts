import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


export type ItineraryItem = {
    siteName?: string;
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

  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };
  
  export type ItineraryItems = ItineraryItem[];
  
  export type UserAccess = {
    uid: string;
    email?: string;
    username?: string;
    profilePictureUrl?: string;
    itineraryId: string;
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

  export type ItinerarySettings = {
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: string;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';

  }
      
  export type Itinerary = {
    id: string,
    uid: string,
    settings?: ItinerarySettings;
    items?: ItineraryItems;
  }


  export type TimeObject = {
    time?: firebase.firestore.Timestamp | null;
  };
  
  export type TransformedItineraryItem   = {
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

export type IndexDBItineraryItem   = {
  siteName?: string;
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
  id: string;
  uid: string,
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
  itineraryId: string;
  title?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  galleryPhotoUrl?: string;
  visibility: 'private' | 'shared' | 'public';
}
