import { db } from '../../FirebaseAuthComponents/config/firebase.database'; // Adjust the import path as needed

interface TokenData {
  token: string | null;
  expirationTime: number | null;
}

const fetchTokenData = async (userID: string): Promise<TokenData> => {
  try {
    console.log('Fetching token data from Firebase for user', userID);
    const userTokenRef = db.collection('UserToken').doc(userID);
    const doc = await userTokenRef.get();

    if (doc.exists) {
      const data = doc.data() as TokenData;
      return {
        token: data.token || null,
        expirationTime: data.expirationTime || null,
      };
    } else {
      // Handle the case where there is no such token
      return { token: null, expirationTime: null };
    }
  } catch (error) {
    console.error('Error fetching token data from Firebase', error);
    return { token: null, expirationTime: null }; // Return nulls if there's an error
  }
};

export default fetchTokenData;
