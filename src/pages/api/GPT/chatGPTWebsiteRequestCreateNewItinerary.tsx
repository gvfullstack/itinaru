import {admin} from "../../../utils/firebase.admin";
import dbServer from "../../../utils/firebase.admin"; 
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIDFromToken } from './utils/getUserIDFromToken'; // Adjust the import path as needed
import { getUserProfilePictureUrl } from './utils/getUserProfilePictureUrl'; // Adjust the import path as needed

export default async function createItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userToken, settings } = req.body;
      let userId = "aOmGE5uedJTuxBTZGexTdOkUHbu1"; // Default userId
      let profilePictureUrl = "https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/profilePictures%2FaOmGE5uedJTuxBTZGexTdOkUHbu1%2FprofilePicture?alt=media&token=3a432d96-92d0-40b2-8812-45f01462f078"; 

      if(userToken){
        const { userID: tokenUserID, error: tokenError } = await getUserIDFromToken(userToken);
        
        if (tokenError) {
          return res.status(401).json({ error: tokenError }); // Send error message if token is invalid or expired
        }
        if (tokenUserID) {
          userId = tokenUserID; // Set userId from the token if valid
          const { profilePictureUrl: userPicUrl, error: picError } = await getUserProfilePictureUrl(userId);

          if (picError) {
            console.error('Error retrieving profile picture URL:', picError); // Log the error but don't stop the process
          } else if (userPicUrl) {
            profilePictureUrl = userPicUrl; // Set profilePictureUrl if found
          }
        } else {
          return res.status(401).json({ error: 'Invalid token' }); 
      }
    }

      const batch = dbServer.batch();
      const itineraryId = dbServer.collection('itineraries').doc().id;
      const itineraryRef = dbServer.collection('itineraries').doc(itineraryId);

      const localSettings = {...settings};
      localSettings.visibility = "public";

      batch.set(itineraryRef, {
        id: itineraryId,
        creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        uid: userId,
        isDeleted: false,
        profilePictureUrl: profilePictureUrl || "",
        settings:{...localSettings}

      });

      await batch.commit();
      res.status(200).json({ message: "Itinerary created successfully", itineraryId: itineraryId, userId: userId});
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
