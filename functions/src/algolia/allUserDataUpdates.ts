import * as functions from 'firebase-functions';
import { userIndex } from './algoliaConfig'; // Adjust this import to match your setup
import { AuthenticatedUser, PrivacySettings } from './algoliaRulesTypes'; // Adjust this import to match your setup

export const updateUserIndex = functions.firestore.document('users/{userId}')
  .onWrite(async change => {
    // Explicitly set the type here
    const rawData = change.after.data();
    const newData: { [key: string]: any } = rawData ? rawData as AuthenticatedUser : {};
    
    // Handle deleted user
    if (!change.after.exists) {
      console.log('User deleted. Removing from Algolia index.');
      return userIndex.deleteObject(change.before.id);
    }

    // Explicitly set the type here
    const privacySettings = newData?.privacySettings as PrivacySettings | undefined;

    // Handle newly created or updated user
    if (privacySettings) {
      // Create an object that includes only the fields allowed by the privacy settings
      const indexObject: { [key: string]: any } = {
        objectID: change.after.id,
      };

      const possibleKeys: Array<keyof PrivacySettings> = ['username', 'email', 'profilePictureUrl'];

      for (const field of possibleKeys) {
        if (privacySettings[field] && newData && newData[field] != null) {
          indexObject[field] = newData[field];
        }
      }
        // Check if the user has opted to be searchable by email
        if (privacySettings.emailSearchable && newData?.email) {
          indexObject.email = newData.email;
        }

      return userIndex.saveObject(indexObject);
    } else {
      // If privacySettings is not defined, you may choose to remove the user from Algolia index
      console.log('Privacy settings not defined. Removing from Algolia index.');
      return userIndex.deleteObject(change.after.id);
    }
  });
