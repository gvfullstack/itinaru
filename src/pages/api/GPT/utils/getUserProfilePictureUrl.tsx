import dbServer from "../../../../utils/firebase.admin"; // Assuming you have a utility to initialize Firebase Admin SDK

// Utility function to get user's profile picture URL by userID
export const getUserProfilePictureUrl = async (userID: string) => {
    try {
        const userDoc = await dbServer.collection('Users')
                                      .doc(userID)
                                      .get();
        
        if (!userDoc.exists) {
            return { profilePictureUrl: null, error: 'No matching user record' };
        }

        const userData = userDoc.data();
        
        if (userData && userData.profilePictureUrl) {
            return { profilePictureUrl: userData.profilePictureUrl, error: null }; // Valid userID and profilePictureUrl found
        } else {
            return { profilePictureUrl: null, error: 'Profile picture URL not found' }; // User record doesn't contain profilePictureUrl
        }
    } catch (error: unknown) {
        // Use a type guard to check if the error is an instance of Error
        if (error instanceof Error) {
            console.error('Error getting user profile picture URL:', error.message);
            return { profilePictureUrl: null, error: error.message }; // Return the error message if it's an Error instance
        } else {
            // If it's not an Error instance, handle it accordingly (e.g., log the error as a string)
            console.error('An unexpected error occurred:', error);
            return { profilePictureUrl: null, error: 'An unexpected error occurred' }; // Provide a generic error message
        }
    }
};
