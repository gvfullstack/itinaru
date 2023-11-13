import {atom} from 'recoil';
import { Itinerary, ItineraryItems, ItineraryItem} from './publicItinViewTypeDefs'
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
  

export const currentlyViewingItineraryState = atom<Itinerary | null>({
    key: 'currentlyViewingItineraryState',
    default: defaultItinerary,
  });
 

 