import admin from 'firebase-admin';
import dbServer from "../../../utils/firebase.admin"; 
import { TransformedItineraryItem, TimeObject } from './gptRelatedTypeDefs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addItemToItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { itineraryId, item } = req.body;
      const itemsRef = dbServer.collection('itineraries').doc(itineraryId).collection('items');
      const itemRef = itemsRef.doc(); // Firestore document reference for the item

    // Function to convert ISO 8601 UTC time string to TimeObject
      const convertToTimeObject = (timeString: string) => {
        // Parse the string as UTC
        const date = new Date(timeString);
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));

        const timestamp = admin.firestore.Timestamp.fromDate(utcDate);
        return { time: timestamp };
      };


            // Convert startTime and endTime to TimeObject
      const startTimeObject = item.startTime ? convertToTimeObject(item.startTime) : null;
      const endTimeObject = item.endTime ? convertToTimeObject(item.endTime) : null;



      await itemRef.set({
        ...item,
        startTime: startTimeObject,
        endTime: endTimeObject,
        creationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),  
        isDeleted: false,
        descHidden: true,
        id: itemRef.id,
        itineraryParentId: itineraryId,
        beingEdited: false
      });

      res.status(200).json({ message: `Item added successfully to itinerary ${itineraryId}` });
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
