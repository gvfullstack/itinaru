import { atom } from 'recoil';
import {TransformedItinerary } from '../EditFormComponents/editFormTypeDefs';

export const myItinerariesResults = atom<TransformedItinerary[]>({
    key: 'myItinerariesFetchResults',
    default: [],
  });