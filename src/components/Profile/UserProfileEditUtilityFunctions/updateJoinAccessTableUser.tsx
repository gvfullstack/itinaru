import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {UpdateUserAccessProps} from '../UserProfileTypeDefs';

export const updateItineraryAccessUser = async ({
    uid, 
    email,
    username,
    profilePictureUrl,
}: UpdateUserAccessProps) => {
  const db = firebase.firestore();
  const querySnapshot = await db
    .collection('itineraries')
    .where('uid', '==', uid)
    .get();

  if (querySnapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  const batch = db.batch();

  querySnapshot.forEach((doc) => {
    const docRef = db.collection('itineraries').doc(doc.id);

    const updateData: Partial<UpdateUserAccessProps> = {
        uid,
    };

    // if (email) updateData.email = email;
    // if (username) updateData.username = username;
    if (profilePictureUrl) updateData.profilePictureUrl = profilePictureUrl;

    // batch.update(docRef, updateData);
    batch.set(docRef, { profilePictureUrl }, { merge: true });

  });

  batch.commit()
    .then(() => {
      console.log('Batch update completed successfully.');
    })
    .catch((error) => {
      console.error('Batch update failed: ', error);
    });
};
