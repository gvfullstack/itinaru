import * as functions from 'firebase-functions';
import { index } from './algoliaConfig';

export const deleteFromIndex = functions.firestore.document('itineraries/{itineraryId}')
  .onDelete(snapshot => {
    return index.deleteObject(snapshot.id);
  });
