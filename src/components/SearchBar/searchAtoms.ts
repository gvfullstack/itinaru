import { atom } from 'recoil';
import { AlgoliaHitType } from './searchTypeDefs';


export const searchResultsState = atom<AlgoliaHitType[]>({
  key: 'searchResultsState',
  default: [],
});

export const searchQueryState = atom<string | undefined>({
    key: 'searchQueryState',
    default: undefined,
  });