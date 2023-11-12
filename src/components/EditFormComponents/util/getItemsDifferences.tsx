import isEqual from 'lodash/isEqual';
import { TransformedItineraryItem} from '../editFormTypeDefs'
import dayjs, { Dayjs } from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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

function getUpdatedFields(originalItem: TransformedItineraryItem, updatedItem: TransformedItineraryItem) {
  const updatedFields: Partial<Record<keyof TransformedItineraryItem, any>> = {};

  (Object.keys(updatedItem) as Array<keyof TransformedItineraryItem>).forEach(key => {
    const originalValue = originalItem[key];
    const updatedValue = updatedItem[key];

    if (updatedValue !== undefined && !isEqual(originalValue, updatedValue)) {
      if (key === 'location' && isLocation(updatedValue) && isLocation(originalValue)) {
        const updatedLocation = {
          latitude: updatedValue.latitude ?? originalValue.latitude,
          longitude: updatedValue.longitude ?? originalValue.longitude
        };
        updatedFields.location = updatedLocation;
      } else {
        updatedFields[key] = updatedValue;
      }
    }
  });

  return updatedFields;
}

function isLocation(value: any): value is { latitude: number; longitude: number } {
  return value && typeof value === 'object' && 'latitude' in value && 'longitude' in value;
}


