import { RecoilState } from 'recoil';

// export interface RecoilInputField {
//   atom: RecoilState<string>;
// }

export const ItemTypes = {
  ITINERARY_ITEM: 'itineraryItem',
};

export type Neighborhoods = {
    neighborhood?: string;
    loc?: { lat: number, lng: number }[];
    desc?: string;
    selected?: boolean;
    descHidden?: boolean;
  }

  export type ItineraryItem = {
    title?: string;
    startTime?: {time?: Date, beingEdited?: boolean};
    endTime?: {time?: Date, beingEdited?: boolean};
    description?: string;
    locationAddress?: string;
    locationWebsite?: string;
    expectedPerPersonBudget?: string;
    descHidden?: boolean;
    id?: string;
    averageWeather?: string;
    activityDuration?: number;
    userDefinedRespectedTime?: boolean;
  }


  export type Itinerary = ItineraryItem[];


export type PageComponentProps = {
    children?: React.ReactNode;
  }

export type HandleInputChange = (key: string, value: any) => void;

export type MultiSelectHandler = (key: string, value: any) => void;

export type DefinedProps = {
      displayIntroText?: boolean;
      displayBudgetInput?: boolean;
      displayDatePicker?: boolean;
      displayTimePicker?: boolean;
      inScopeThemes?: string;
      multipleSelectOptions?:RecoilState<Array<{ label: string, selected: boolean}>>
      themeOptionsState?: RecoilState<Array<{ label: string, selected: boolean}>>
      ageRangeOptionsState?: RecoilState<Array<{ label: string, selected: boolean}>>
      itineraryItemsState?: RecoilState<Itinerary>;
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
      multipleSelectObjects?: string[] | Neighborhoods[];
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
