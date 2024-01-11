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
      if (profile.privacySettings.username) publicProfile.username = profile.username ?? null;
      if (profile.privacySettings.userFirstLastName) publicProfile.userFirstLastName = profile.userFirstLastName ?? null;
      if (profile.privacySettings.email) publicProfile.email = profile.email ?? null;
      if (profile.privacySettings.bio) publicProfile.bio = profile.bio ?? null;
      if (profile.privacySettings.profilePictureUrl) publicProfile.profilePictureUrl = profile.profilePictureUrl ?? null;
    }

    return publicProfile;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}
