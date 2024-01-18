export type UpdateUserAccessProps = {
    uid: string;
    email?: string;
    username?: string;
    profilePictureUrl?: string;
  };

  export interface AlgoliaHitType {
    objectID: string; // Common in Algolia hits
    derivedFromItineraryId?: string;
    uid?: string;
    profilePictureUrl?: string;
    settings?: ItinerarySettings;
    itineraryParentId?: string;
    itemTitle?: string;
    description?: string;
    locationAddress?: string;
    // ... include other fields as necessary
  }

  export type ItinerarySettings = {
    title: string;
    description: string;
    neighborhood?: string;
    city: string;
    state: string;
    duration?: string;
    galleryPhotoUrl?: string;
    visibility: 'private' | 'shared' | 'public';
    keywords?: string;
  }
      