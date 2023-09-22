import { atom } from 'recoil';

type AlgoliaItinerary = {
    id: string;
    uid: string;
    settings: {
      title: string;
      description: string;
      neighborhood: string;
      city: string;
      state: string;
      duration: string;
      galleryPhotoUrl: string;
    };
  };

export const searchResultsState = atom<AlgoliaItinerary[]>({
  key: 'searchResultsState',
  default: [],
});

export const searchQueryState = atom<string>({
    key: 'searchQueryState',
    default: "",
  });