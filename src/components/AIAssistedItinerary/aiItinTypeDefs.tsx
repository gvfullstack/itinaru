import { RecoilState } from 'recoil';
import { Timestamp } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';


// export interface RecoilInputField {
//   atom: RecoilState<string>;
// }

export const ItemTypes = {
  ITINERARY_ITEM: 'itineraryItem',
};


  export type ItineraryItem = {
    itemTitle?: string;
    startTime?: {time?: Date | null, beingEdited?: boolean};
    endTime?: {time?: Date | null, beingEdited?: boolean};
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


  export type ItineraryItems = ItineraryItem[];

  export type ItinerarySettings = {
    id?: string;
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: number;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    readAccess?: string[];
    editAccess?: string[];
  }
      
  export type Itinerary = {
    settings: ItinerarySettings;
    items: ItineraryItems;
  }



export type PageComponentProps = {
    children?: React.ReactNode;
  }

export type HandleInputChange = (key: string, value: any) => void;

export type MultiSelectHandler = (key: string, value: any) => void;

export type DefinedProps = {
    getNeigborhoodButtonText?: string;
      displayGetNeighborhoodsButton?: boolean;
      displayDirectionsMap?: boolean;
      displayItinerary?: boolean;
      displayNeighborhoodRecommendations?: boolean;
      displayDetailedTravelPreferences?: boolean; 
      displayParentUPComponent?: boolean;
      displayDestinationInput?: boolean;
      displayIntroText?: boolean;
      displayDatePicker?: boolean;
      displayTimePicker?: boolean;
      inScopeThemes?: string;
      multipleSelectOptions?:RecoilState<Array<{ label: string, selected: boolean}>>
      themeOptionsState?: RecoilState<Array<{ label: string, selected: boolean}>>
      ageRangeOptionsState?: RecoilState<Array<{ label: string, selected: boolean}>>
      itineraryItemsState?: RecoilState<ItineraryItems>;
      singleSelectOptions?: RecoilState<Array<{ numVal: string, label: string, selected: boolean}>>;
      curStep?: string;
      pageStep?: string;
      prevPageStep?: string;
      nextPageStep?: string;
      nextPageStepR2?: string
      introText?: string;
      destinationState?: RecoilState<string>;
      infoText1?: string;
      infoText2?: string;
      prompt?: string;
      destination?: string; 
      createButtonText?: string;
      nextButtonText?: string; 
      nextButtonStaticValue?: string | boolean //assign a static value for values that cannot be inferred from state variable being updated and helps distinguish what button selection means when more than one button exists in a page
      nextButton2Text?: string; 
      nextButton2StaticValue?: string | boolean //assign a static value for values that cannot be inferred from state variable being updated and helps distinguish what button selection means when more than one button exists in a page
      backButtonText?: string;
      travelDate?: string;
      userInput?: RecoilState<string>;
      userInput1?: RecoilState<string>;
      userInput2?: RecoilState<string>;
      keyOfStateVariable?: string;
      keyOfStateVariable2?: string;
      specificSitesBool?: boolean;
      specificSites?: string;
      itineraryItems?: string;
      excludedSites?: string;
      paceState?: RecoilState<Array<{ numVal: string, label: string, selected: boolean}>>;
      shouldAutoFocus?: boolean;
      travelerCount?: string;
      keyOfMultiSelectButton?: string;
      ageRangeSelection?: string[];
      handleMultiSelect?: MultiSelectHandler; 
      handleInputChange?: HandleInputChange;
      selectedOptions?: string[];  
      themeSelections?: string[]; 
      userDefinedThemes?: string;
      userDefinedNeighborhoods?: string;
      nextButtonGenerateAPI?: boolean;
      isLoading?: boolean;
      separatorText?: string;
      userInputPlaceholder?: string;
      userInputPlaceholder2?: string;
      showNeighborhoods?: boolean;
      showMap?: boolean;
    };
////////////////////////
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

export type TripPreferences = {
  showTripInfo?: Boolean;
  showTripPreferences?: Boolean;
  destination?: string;
  travelDate?: Date;
  startTime?: Date;
  endTime?: Date;
  specificSitesToInclude?: string[];
  specificSitesToExclude?: string[];
  experienceSoughtThisTrip?: string;
  neighborhoodsToExplore?: Array<string>;
  typeOfEateriesToIncludeInItinerary?: Array<{ label: string, selected: boolean}>;
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

export type BrandPageRender = {
  animationComplete?: boolean;}

//////auth State  ///////////////

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
  firstName?: boolean;
  lastName?: boolean;
  phoneNumber?: boolean;
  email?: boolean;
  bio?: boolean;
  profilePictureUrl?: boolean;
};