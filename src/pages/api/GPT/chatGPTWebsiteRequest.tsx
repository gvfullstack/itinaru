import admin from 'firebase-admin';
import dbServer, { storageServer } from "../../../utils/firebase.admin"; 
import { TransformedItinerary, TransformedItineraryItem } from './gptRelatedTypeDefs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { settings, items } = req.body;
      const batch = dbServer.batch();
      
      // Generate a new ID for the itinerary
      const itineraryId = dbServer.collection('itineraries').doc().id;
      const itineraryRef = dbServer.collection('itineraries').doc(itineraryId);
      const itemsRef = itineraryRef.collection('items');

      // Calculate total duration and set visibility
      settings.duration = items.reduce((total:number, item:TransformedItineraryItem) => total + (item.activityDuration ?? 0), 0);
      settings.visibility = 'public';

      // Handle image upload if exists
      if (settings.galleryPhotoUrl) {
        const image = settings.galleryPhotoUrl; // Assuming this is a file/blob
        const imageRef = storageServer.bucket().file(`itineraries/${'aOmGE5uedJTuxBTZGexTdOkUHbu1'}/${itineraryId}`);
        await imageRef.createWriteStream().end(image);
        settings.galleryPhotoUrl = await imageRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });
      }

      // Add itinerary settings to batch
      batch.set(itineraryRef, {
        ...settings,
        creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        uid: "aOmGE5uedJTuxBTZGexTdOkUHbu1",
        isDeleted: false,
        profilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/profilePictures%2FaOmGE5uedJTuxBTZGexTdOkUHbu1%2FprofilePicture?alt=media&token=3a432d96-92d0-40b2-8812-45f01462f078"
      });

      // Process each itinerary item and add to batch
      items.forEach((item: TransformedItineraryItem) => {
            // Generate a new ID for the item
        const itemId = dbServer.collection('itineraries').doc(itineraryId).collection('items').doc().id;

          // Base date set to January 1, 2021
        const baseDate = new Date('2021-01-01T00:00:00Z');

        let startTimeTimestamp = null;
        let endTimeTimestamp = null;

        if (item.startTime?.time) {
          const startTime = item.startTime.time.toDate();
          const startTimeDate = new Date(baseDate);
          startTimeDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          startTimeTimestamp = admin.firestore.Timestamp.fromDate(startTimeDate);
        }

        if (item.endTime?.time) {
          const endTime = item.endTime.time.toDate();
          const endTimeDate = new Date(baseDate);
          endTimeDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          endTimeTimestamp = admin.firestore.Timestamp.fromDate(endTimeDate);
        }
      
        const itemRef = itemsRef.doc(); // Firestore document reference for the item
      
        batch.set(itemRef, {
          ...item,
          creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          startTime: startTimeTimestamp,
          endTime: endTimeTimestamp,      
          isDeleted: false,
          descHidden: true,
          id: itemId,
          itineraryParentId: itineraryId,
          beingEdited: false
        });
      });

      // Commit the batch operation to Firestore
      await batch.commit();

      // Respond with URL to view itinerary
      res.status(200).json({ message: `Itinerary is now available at https://www.itinaru.com/viewItinerary/${itineraryId} for you to copy to your account and edit` });
    } catch (error) {
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: "An unknown error occurred" });
      }
  }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
