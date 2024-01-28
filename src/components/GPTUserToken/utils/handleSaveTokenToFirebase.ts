import { db } from '../../FirebaseAuthComponents/config/firebase.database'

interface SaveTokenParams {
  userID: string;
  token: string;
  expirationTime: number; // Expiration time in milliseconds
}

const handleSaveTokenToFirebase = async ({ userID, token, expirationTime }: SaveTokenParams): Promise<void> => {
  try {
    const userTokenRef = db.collection('UserToken').doc(userID);
    await userTokenRef.set({
      userID,
      token,
      expirationTime, // Save the expiration time along with the token
    }, { merge: true }); // Using merge option to update if exists, or create if not
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token to Firebase', error);
  }
};

export default handleSaveTokenToFirebase;
