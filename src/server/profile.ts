import dbServer  from '../utils/firebase.admin';

import { AuthenticatedUser } from "@/components/typeDefs";

export async function getPublicProfileWithAdminSDK(userId: string) {
  try {

    const userDoc = await dbServer.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.error('User not found');
      return null;
    }
    const profile = userDoc.data() as AuthenticatedUser;

    let publicProfile: Partial<AuthenticatedUser> = {};

    if (profile.privacySettings) {
      // Explicitly include fields based on privacy settings
      if (profile.privacySettings.username) publicProfile.username = profile.username;
      if (profile.privacySettings.firstName) publicProfile.firstName = profile.firstName;
      if (profile.privacySettings.lastName) publicProfile.lastName = profile.lastName;
      if (profile.privacySettings.phoneNumber) publicProfile.phoneNumber = profile.phoneNumber;
      if (profile.privacySettings.email) publicProfile.email = profile.email;
      if (profile.privacySettings.bio) publicProfile.bio = profile.bio;
      if (profile.privacySettings.profilePictureUrl) publicProfile.profilePictureUrl = profile.profilePictureUrl;
    }

    return publicProfile;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}
