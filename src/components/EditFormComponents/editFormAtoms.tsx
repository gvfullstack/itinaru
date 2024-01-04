import {atom} from 'recoil';
import { Itinerary, ItineraryAccess, ItineraryItem,AlgoliaUser} from './editFormTypeDefs'
import { startOfWeek, addDays, format, isAfter } from 'date-fns';

export const defaultItinerary: Itinerary = {
    uid: "",
    id: "",  
    settings: {
      title: "",
      description: "",
      city: "",
      state: "",
      visibility: "private" // or any other default value
    },
    items: []
  };
  
export const newItineraryState = atom<Itinerary>({
  key: 'newItineraryStateEF',
  default: defaultItinerary,
});


export const currentlyEditingItineraryState = atom<Itinerary>({
    key: 'currentlyEditingItineraryStateEF',
    default: defaultItinerary,
  });
 

  export const showItineraryEditForm = atom<boolean>({
    key: 'showItineraryEditFormEF',
    default: false
  });
 
  export const saveStatusDisplayedEditFormContainer = atom<string>({
    key: 'saveStatusDisplayedEditFormContainerEF',
    default: ""
  });   

 

  export const searchUserResultsState = atom<AlgoliaUser[]>({
    key: 'searchUserResultsState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

  export const searchUserQueryState = atom<string>({
    key: 'searchUserQueryState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });

  export const itineraryAccess = atom<ItineraryAccess>({
    key: 'itineraryAccessState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

  export const itineraryAccessItinView = atom<ItineraryAccess>({
    key: 'itineraryAccessItinViewState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });


  export const itineraryInEditNeedsDeletionFromRecoilState = atom<boolean>({
    key: 'itineraryInEditNeedsDeletionFromRecoilState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
  });