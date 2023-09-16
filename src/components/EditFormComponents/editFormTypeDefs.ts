import dayjs, { Dayjs } from 'dayjs';


export type ItineraryItem = {
    siteName?: string;
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
    imageUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    readAccess?: string[];
    editAccess?: string[];
  }
      
  export type Itinerary = {
    id?: string,
    uid: string,
    settings: ItinerarySettings;
    items: ItineraryItems;
  }
