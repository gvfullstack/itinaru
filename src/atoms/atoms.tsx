import {atom} from 'recoil';
import { ItineraryItems, UserPreferences, TripPreferences, 
  NeighborhoodRecommendationList, DefinedProps, Affiliates,
  BrandPageRender, AuthenticatedUser,PrivacySettings, Itinerary} from '@/components/typeDefs'
import { startOfWeek, addDays, format, isAfter } from 'date-fns';

export const itineraryItemsState = atom<ItineraryItems>({
  key: 'itineraryItemsState', 
  default: [
    ]
});


  export const curStepState = atom<string>({
    key: 'curStepState',
    default: '10T'
  })
  
  
  export const defaultAtom = atom<any>({
    key: 'defaultAtom', 
    default: "No atom found"
  });

  export const affiliatesAtom = atom<Affiliates>({
    key: 'affiliatesAtom', 
    default: {
      showAffiliatesLinks: false
    }
  });
 
export const userPreferencesAtom = atom<UserPreferences>({
  key: 'userPreferences',
  default: {
    showUserPreferences: false,
    favoritePlacesPreviouslyVisited: [],
    favoriteExperienceTypes:  [
      { 
        label:"culture & history", 
        selected: false},
      {
        label:"relaxation", 
        selected: false},
      {
        label:"parks", 
        selected: false},
      {
        label:"food and drink", 
        selected: false},
      {
        label: "city exploration", 
        selected: false},
      {
        label:"beaches", 
        selected: false},
      {
        label:"adventure",
        selected: false},        
      {
        label:"tourist attractions",
        selected: false},
      {
        label:"nature & wildlife",
        selected: false}
      ],
    favoriteRestaurantsPreviouslyVisited: [],
    
    favoriteCuisine: [
      {label:"Mexican", selected: false}, 
      {label:"Thai", selected: false}, 
      {label:"Chinese", selected:false}, 
      {label:"Italian", selected: false}, 
      {label:"Indian", selected: false}, 
      {label:"Japanese", selected:false}, 
      {label:"Spanish", selected: false}, 
      {label:"Greek", selected: false}, 
      {label:"Middle Eastern", selected:false}, 
      {label:"Street Food", selected: false},
      {label:"Vegan", selected: false}, 
      {label:"Vegetarian", selected: false}
    ],
    diningExperience: [ 
      {label:"Fast Food", selected:false},
      {label:"Casual", selected: false}, 
      {label:"Fine Dining", selected: false} 
      ],
    dailyBudget: {Amount:"", Currency:"USD"},
    preferredPace:[
      {label:"Relaxed", selected: ""},
      {label:'Moderate', selected: ""},
      {label:"Fast-Paced", selected: ""}
    ]
  },
});

          const getNextFriday = () => {
            const today = new Date();
            const nextFriday = startOfWeek(today, { weekStartsOn: 5 }); // Start the week on Friday (5)
            return isAfter(today, nextFriday) ? addDays(nextFriday, 7) : nextFriday; // If today is after the next Friday, add 7 days to get the following week's Friday
          };

export const tripPreferencesAtom = atom<TripPreferences>({
  key: 'tripPreferences',
  default: {
    showTripInfo: true,
    showTripPreferences: false,
    destination: "",
    travelDate: getNextFriday(), // Default travel date is the upcoming Friday
    startTime: new Date(new Date().setHours(8, 0, 0, 0)),
    endTime: new Date(new Date().setHours(18, 30, 0, 0)),
    specificSitesToInclude: [],
    experienceSoughtThisTrip: "",  
    neighborhoodsToExplore: [],  
    typeOfEateriesToIncludeInItinerary: [{label:"Coffee", selected: false}, {label:"Breakfast", selected: false}, {label:"Lunch", selected: false}, {label:"Dinner", selected: false},]
  }
});


export const neighborhoodRecommendationList = atom<NeighborhoodRecommendationList>({
  key: 'neighborhoodRecommendationList',
  default:{ 
    neighborhoodRecommendationArray:[],
    showNeighborhoodList: false,
    showNeighborhoodSection: false,
    selectedIndicesAtom: [],
    hoverIndexAtom: null
  }
});

export const pagePropsAtom = atom<DefinedProps[]>({
  key: 'pagePropsAtom',
  default: [
    {
      pageStep: "10T",
      prevPageStep: "10T",
      nextPageStep: "20T",
      createButtonText: "create itinerary now!",
      displayDestinationInput: true,
      displayIntroText: true,       
      displayDatePicker: true, 
      displayTimePicker: true,
      displayParentUPComponent: true,
      displayDetailedTravelPreferences: true,
      displayGetNeighborhoodsButton: true,
      displayNeighborhoodRecommendations: true,
    },
    {   
      pageStep: "20T",
      itineraryItemsState: itineraryItemsState,
      displayItinerary: true,
      displayDirectionsMap: true,
    }
  ],
});

export const brandPageRender = atom<BrandPageRender>({
  key: 'brandPageRender', 
  default: {
    animationComplete: false
  }
});

////////auth state////////

export const authUserState = atom<AuthenticatedUser | null>({
  key: 'authState',
  default: null,
});

export const privacySettingsState = atom<PrivacySettings | null>({
  key: 'privacySettingsState',
  default: null,
});


