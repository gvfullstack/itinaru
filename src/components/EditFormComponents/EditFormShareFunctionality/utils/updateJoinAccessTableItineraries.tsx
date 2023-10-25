import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {UpdateItineraryAccessProps} from '../../editFormTypeDefs';

export const updateItineraryAccess = async ({
  itineraryId,
  title,
  neighborhood,
  city,
  state,
  galleryPhotoUrl,
  visibility,
}: UpdateItineraryAccessProps) => {
  const db = firebase.firestore();
  const querySnapshot = await db
    .collection('ItineraryAccess')
    .where('itineraryId', '==', itineraryId)
    .get();

  if (querySnapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  const batch = db.batch();

  querySnapshot.forEach((doc) => {
    const docRef = db.collection('ItineraryAccess').doc(doc.id);

    const updateData: Partial<UpdateItineraryAccessProps> = {
      itineraryId,
      visibility,
    };

    if (title) updateData.title = title;
    if (neighborhood) updateData.neighborhood = neighborhood;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (galleryPhotoUrl) updateData.galleryPhotoUrl = galleryPhotoUrl;

    batch.update(docRef, updateData);
  });

  batch.commit()
    .then(() => {
      console.log('Batch update completed successfully.');
    })
    .catch((error) => {
      console.error('Batch update failed: ', error);
    });
};
