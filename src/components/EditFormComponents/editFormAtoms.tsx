import {atom} from 'recoil';
import { Itinerary, ItineraryItems, ItineraryItem} from './editFormTypeDefs'
import { startOfWeek, addDays, format, isAfter } from 'date-fns';

export const defaultItinerary: Itinerary = {
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
  

export const currentlyEditingItineraryState = atom<Itinerary>({
    key: 'currentlyEditingItineraryState',
    default: defaultItinerary,
  });
 

  export const showItineraryEditForm = atom<boolean>({
    key: 'showItineraryEditForm',
    default: false
  });
 