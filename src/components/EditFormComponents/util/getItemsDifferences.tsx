import isEqual from 'lodash/isEqual';
import { TransformedItineraryItem, TimeObject} from '../editFormTypeDefs'
import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {serverTimestamp } from 'firebase/firestore'

export function getUpdatedItemFields(
  originalItems: TransformedItineraryItem[],
  updatedItems: TransformedItineraryItem[]
): Array<{ id: string; updatedFields: Partial<Record<keyof TransformedItineraryItem, any>> }> {
  
  const updatedFieldsArray: Array<{ id: string; updatedFields: Partial<Record<keyof TransformedItineraryItem, any>> }> = [];
  const originalItemsMap = new Map<string, TransformedItineraryItem>(originalItems.map(item => [item.id!, item]));

  updatedItems.forEach(updatedItem => {
    const originalItem = originalItemsMap.get(updatedItem.id!);
    
    // If there is an original item, check for changes and update
    if (originalItem) {
      const updatedFields = getUpdatedFields(originalItem, updatedItem);
      if (Object.keys(updatedFields).length > 0) {
        updatedFieldsArray.push({ id: updatedItem.id!, updatedFields });
      }
    } else {
      // If no original item is found, add the updated item as a whole
      updatedFieldsArray.push({ id: updatedItem.id!, updatedFields: { ...updatedItem } });
    }
  });

  return updatedFieldsArray;
}

// Utility function to create a default timestamp for midnight
function getDefaultMidnightTimestamp(): firebase.firestore.Timestamp {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to midnight
  return firebase.firestore.Timestamp.fromDate(now);
}

// Type guard to check if a value is a TimeObject
function isTimeObject(value: any): value is TimeObject {
  return value && typeof value === 'object' && 'time' in value;
}

function getUpdatedFields(originalItem: TransformedItineraryItem, updatedItem: TransformedItineraryItem) {
  const updatedFields: Partial<Record<keyof TransformedItineraryItem, any>> = {};

  let isChanged = false; // Flag to track if any field has changed

  (Object.keys(updatedItem) as Array<keyof TransformedItineraryItem>).forEach(key => {
    const originalValue = originalItem[key];
    const updatedValue = updatedItem[key];

    if (!isEqual(originalValue, updatedValue)) {
      isChanged = true;

      // Specific logic for startTime and location
      if (key === 'startTime' && (!isTimeObject(updatedValue) || updatedValue?.time === undefined)) {
        updatedFields.startTime = { time: getDefaultMidnightTimestamp() };
      } else if (key === 'location' && isLocation(updatedValue) && isLocation(originalValue)) {
        const updatedLocation = {
          latitude: updatedValue.latitude ?? originalValue.latitude,
          longitude: updatedValue.longitude ?? originalValue.longitude
        };
        updatedFields.location = updatedLocation;
      } else {
        // Generic update for all other fields
        updatedFields[key] = updatedValue;
      }
    }
  });

  // If any field has changed, set the lastUpdatedTimestamp
  if (isChanged) {
    updatedFields.lastUpdatedTimestamp = serverTimestamp();
  }
  
  return updatedFields;
}

function isLocation(value: any): value is { latitude: number; longitude: number } {
  return value && typeof value === 'object' && 'latitude' in value && 'longitude' in value;
}


