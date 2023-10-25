import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export const deleteItineraryAccessRecords = async (itineraryId: string) => {
  const db = firebase.firestore();
  
  // Query for all documents in 'ItineraryAccess' that match the 'itineraryId'
  const querySnapshot = await db
    .collection('ItineraryAccess')
    .where('itineraryId', '==', itineraryId)
    .get();

  if (querySnapshot.empty) {
    console.log('No matching documents.');
    return;
  }
  
  // Start a new batch
  const batch = db.batch();

  // Iterate through each document and schedule it for deletion
  querySnapshot.forEach((doc) => {
    const docRef = db.collection('ItineraryAccess').doc(doc.id);
    batch.delete(docRef);
  });

  // Commit the batch
  batch.commit()
    .then(() => {
      console.log('Batch delete completed successfully.');
    })
    .catch((error) => {
      console.error('Batch delete failed: ', error);
    });
};
