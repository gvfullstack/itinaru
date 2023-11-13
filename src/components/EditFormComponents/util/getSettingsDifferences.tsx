import { ItinerarySettings } from '../editFormTypeDefs';
import isEqual from 'lodash/isEqual';

function isVisibility(value: any): value is 'private' | 'shared' | 'public' {
  return ['private', 'shared', 'public'].includes(value);
}

// Define the shape of the updated settings object for Firestore
interface FirestoreSettingsUpdate {
  [key: string]: any;
}

export function getSettingsDifferences(
  originalSettings: ItinerarySettings, 
  updatedSettings: ItinerarySettings
): FirestoreSettingsUpdate {
  const settingsDifferences: FirestoreSettingsUpdate = {};
  // Iterate over the keys of ItinerarySettings
  (Object.keys(originalSettings) as (keyof ItinerarySettings)[]).forEach((key) => {
    if (!isEqual(originalSettings[key], updatedSettings[key])) {
      if (key === 'visibility') {
        if (isVisibility(updatedSettings[key])) {
          // Prefix the key with 'settings.' for Firestore update
          settingsDifferences[`settings.${key}`] = updatedSettings[key];
        }
      } else {
        // Prefix the key with 'settings.' for Firestore update
        settingsDifferences[`settings.${key}`] = updatedSettings[key];
      }
    }
  });
  return settingsDifferences;
}
