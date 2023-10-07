import { atom } from 'recoil';
import {TransformedItinerary } from './myItinerariesTypeDefs';

export const myItinerariesResults = atom<TransformedItinerary[]>({
    key: 'myItinerariesFetchResults',
    default: [],
  });