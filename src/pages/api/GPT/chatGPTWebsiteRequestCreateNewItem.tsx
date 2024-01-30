import  dbServer from "../../../utils/firebase.admin";
import { admin } from "../../../utils/firebase.admin";
import { TransformedItineraryItem, TimeObject } from './gptRelatedTypeDefs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addItemToItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { itineraryId, item } = req.body;
      const itemsRef = dbServer.collection('itineraries').doc(itineraryId).collection('items');
      const itemRef = itemsRef.doc(); // Firestore document reference for the item

      // Function to convert ISO 8601 UTC time string to TimeObject
      const createTimeObject = (timeString: string) => {
        if (!timeString) return null;
        const date = new Date(timeString);
        const timestamp = admin.firestore.Timestamp.fromMillis(date.getTime());
        return { time: timestamp };
      };
      // startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },

      // Convert startTime and endTime to TimeObject
      const startTimeObject = item.startTime ? createTimeObject(item.startTime) : null;
      const endTimeObject = item.endTime ? createTimeObject(item.endTime) : null;

      // Update the description to include the original and converted times
      const updatedDescription = `${item.description || ''}\nOriginal Start Time: ${item.startTime}\nConverted Start Time: ${startTimeObject?.time.toDate().toISOString()}\nOriginal End Time: ${item.endTime}\nConverted End Time: ${endTimeObject?.time.toDate().toISOString()}`;

      await itemRef.set({
        ...item,
        description: updatedDescription,
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