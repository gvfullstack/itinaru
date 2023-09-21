import dayjs, { Dayjs } from 'dayjs';
import { RecoilState } from 'recoil';

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
  
  export type NeighborhoodRecommendation = {
    rating?: string;
    title?: string;
    description?: string;
  }
  
  export type NeighborhoodRecommendationList = {
    neighborhoodRecommendationArray?: NeighborhoodRecommendation[];
    showNeighborhoodList?:Boolean;
    showNeighborhoodSection?:Boolean;
    selectedIndicesAtom?: number[];
    hoverIndexAtom?:number | null
  };
  
  export type Affiliates = {
    showAffiliatesLinks?: Boolean;
  }
  
  

  export type UserPreferences = {
    showUserPreferences?: Boolean;
    favoritePlacesPreviouslyVisited?: string[];
    favoriteExperienceTypes?: Array<{ label: string, selected: boolean}>;
    favoriteRestaurantsPreviouslyVisited?: string[];
    favoriteCuisine?: Array<{ label: string, selected: boolean}>;
    diningExperience?: Array<{ label: string, selected: boolean}>;
    dailyBudget?: {
      Amount?: string;
      Currency?: string;
    };
    preferredPace: Array<{ label: string, selected: string}>;
  };