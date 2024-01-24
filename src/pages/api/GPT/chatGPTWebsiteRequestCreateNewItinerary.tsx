import admin from 'firebase-admin';
import dbServer from "../../../utils/firebase.admin"; 
import { NextApiRequest, NextApiResponse } from 'next';

export default async function createItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { settings } = req.body;
      const batch = dbServer.batch();
      
      const itineraryId = dbServer.collection('itineraries').doc().id;
      const itineraryRef = dbServer.collection('itineraries').doc(itineraryId);

      const localSettings = {...settings};
      localSettings.visibility = "public";

      batch.set(itineraryRef, {
        ...localSettings,
        creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        uid: "aOmGE5uedJTuxBTZGexTdOkUHbu1",
        isDeleted: false,
        profilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/profilePictures%2FaOmGE5uedJTuxBTZGexTdOkUHbu1%2FprofilePicture?alt=media&token=3a432d96-92d0-40b2-8812-45f01462f078" || "default_url_here"
      });

      await batch.commit();
      res.status(200).json({ message: "Itinerary created successfully", itineraryId: itineraryId });
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
