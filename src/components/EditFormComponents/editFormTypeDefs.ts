import dayjs, { Dayjs } from 'dayjs';


export type ItineraryItem = {
    siteName?: string;
    startTime?: {time?: Dayjs | null, beingEdited?: boolean};
    endTime?: {time?: Dayjs | null, beingEdited?: boolean};
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
  } 

  export const ItemTypes = {
    ITINERARY_ITEM: 'itineraryItem',
  };
  