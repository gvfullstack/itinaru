import dbServer from "../../../../utils/firebase.admin"; // Utility function to get userID from a given token

// Utility function to get userID from a given token
export const getUserIDFromToken = async (token:string) => {
    try {
        const querySnapshot = await dbServer.collection('UserToken')
                                           .where('token', '==', token)
                                           .get();
        if (querySnapshot.empty) {
            return { userID: null, error: 'No matching record' };
        }

        let userID = null;
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const expirationTimeMillis = data.expirationTime;
            const currentTimeMillis = Date.now();

            if (currentTimeMillis <= expirationTimeMillis) {
                userID = data.userID;
            }
        });

        if (userID) {
            return { userID, error: null }; // Valid token and userID found
        } else {
            return { userID: null, error: 'Expired token' }; // Token is expired
        }
    } catch (error: unknown) {
        // Use a type guard to check if the error is an instance of Error
        if (error instanceof Error) {
            console.error('Error getting user ID from token:', error.message);
            return { userID: null, error: error.message }; // Return the error message if it's an Error instance
        } else {
            // If it's not an Error instance, handle it accordingly (e.g., log the error as a string)
            console.error('An unexpected error occurred:', error);
            return { userID: null, error: 'An unexpected error occurred' }; // Provide a generic error message
        }
    }
};
