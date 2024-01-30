import dbServer from "../../../../utils/firebase.admin"; // Assuming you have a utility to initialize Firebase Admin SDK

// Utility function to get user's profile picture URL by userID
export const getItineraryUID = async (itineraryId: string) => {
    try {
        const itineraryDoc = await dbServer.collection('itineraries')
                                      .doc(itineraryId)
                                      .get();
        
        if (!itineraryDoc.exists) {
            return { itineraryUID: null, error: 'No matching itinerary record' };
        }

        const itineraryData = itineraryDoc.data();
        
        if (itineraryData && itineraryData.uid) {
            return { itineraryUID:itineraryData.uid, error: null }; // Valid itineraryUID found
        } else {
            return { itineraryUID: null, error: 'Itinerary UID not found' }; // User record doesn't contain UID
        }
    } catch (error: unknown) {
        // Use a type guard to check if the error is an instance of Error
        if (error instanceof Error) {
            console.error('Error getting itinerary UID:', error.message);
            return { profilePictureUrl: null, error: error.message }; // Return the error message if it's an Error instance
        } else {
            // If it's not an Error instance, handle it accordingly (e.g., log the error as a string)
            console.error('An unexpected error occurred:', error);
            return { profilePictureUrl: null, error: 'An unexpected error occurred' }; // Provide a generic error message
        }
    }
};
