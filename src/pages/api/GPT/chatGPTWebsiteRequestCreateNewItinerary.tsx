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

      batch.set(itineraryRef, {
        ...settings,
        creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        uid: "aOmGE5uedJTuxBTZGexTdOkUHbu1",
        isDeleted: false,
        profilePictureUrl: settings.profilePictureUrl || "default_url_here"
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
