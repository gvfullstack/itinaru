import {atom} from 'recoil';
import { ItineraryItems, UserPreferences, TripPreferences, 
  NeighborhoodRecommendationList, DefinedProps, Affiliates,
  BrandPageRender, AuthenticatedUser,PrivacySettings, Itinerary} from '@/components/typeDefs'
import { startOfWeek, addDays, format, isAfter } from 'date-fns';

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



