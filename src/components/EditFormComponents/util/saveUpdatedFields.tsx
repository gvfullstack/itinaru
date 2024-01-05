import { ItinerarySettings, ItineraryItem, TransformedItinerary} from '../editFormTypeDefs'
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { getSettingsDifferences } from './getSettingsDifferences';
import {getUpdatedItemFields} from './getItemsDifferences';
import { Timestamp } from '@firebase/firestore';
import {serverTimestamp } from 'firebase/firestore'

export async function saveUpdatedFields(originalItinerary:TransformedItinerary, updatedItinerary:TransformedItinerary) {
  const batch = db.batch();
  const settingsRef = db.collection('itineraries').doc(originalItinerary.id);
  const itemsRef = db.collection('itineraries').doc(originalItinerary.id).
    collection('items');
  
  // Handle settings updates
  const updatedSettings = getSettingsDifferences(originalItinerary.settings, 
    updatedItinerary.settings);
  if (Object.keys(updatedSettings).length > 0) {
    batch.update(settingsRef, updatedSettings);
  }

  // Handle items - update and delete
  const originalItems = originalItinerary.items;
  const updatedItems = updatedItinerary.items;

  // Find items to update
  const updatedItemFieldsArray = getUpdatedItemFields(originalItems, updatedItems);
  for (const { id, updatedFields } of updatedItemFieldsArray) {
    if (Object.keys(updatedFields).length > 0) {
      const itemRef = itemsRef.doc(id);
      batch.update(itemRef, updatedFields);
    }
  }

  // Find items to delete
  const originalItemIds = originalItems.map(item => item.id);
  const updatedItemIds = updatedItems.map(item => item.id);
  const itemsToDelete = originalItemIds.filter(id => !updatedItemIds.includes(id));

  for (const itemId of itemsToDelete) {
    const itemRef = itemsRef.doc(itemId);
    batch.delete(itemRef);
  }

  batch.update(settingsRef, { lastUpdatedTimestamp: serverTimestamp() });

  // Commit the batch operation to Firestore
  await batch.commit()
    .then(() => console.log('Batched update successful'))
    .catch((error) => console.error('Batched update failed: ', error));
}