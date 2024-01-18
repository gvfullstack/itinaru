import { atom } from 'recoil';
import { AlgoliaHitType } from './UserProfileTypeDefs';


export const specificUserSearchResultsState = atom<AlgoliaHitType[]>({
  key: 'specificUserSearchResultsState',
  default: [],
});

export const specificUserSearchQueryState = atom<string | undefined>({
    key: 'specificUserSearchQueryState',
    default: undefined,
  });