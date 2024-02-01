import dbServer from "../../../utils/firebase.admin";
import { admin } from "../../../utils/firebase.admin";
import { TransformedItineraryItem, TimeObject } from './gptRelatedTypeDefs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIDFromToken } from './utils/getUserIDFromToken';
import { getItineraryUID } from './utils/getItineraryUID';

export default async function addItemToItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userToken, itineraryId, item, userId } = req.body;
      const itemsRef = dbServer.collection('itineraries').doc(itineraryId).collection('items');
      const itemRef = itemsRef.doc(); // Firestore document reference for the item
      
      // Bypass authentication if the userId is the specific one
      let tokenUserID = userId;
      if (userId !== 'aOmGE5uedJTuxBTZGexTdOkUHbu1') {
        const { userID, error: tokenError } = await getUserIDFromToken(userToken);
        if (tokenError) {
          return res.status(403).json({ error: tokenError });
        }
        tokenUserID = userID;
      }

      const { itineraryUID: itineraryUID, error: itineraryError } = await getItineraryUID(itineraryId);
      if (itineraryError) {
        return res.status(403).json({ error: itineraryError });
      }

      // Compare itineraryUID and tokenUserID, and only proceed if they match
      if (itineraryUID !== tokenUserID) {
        return res.status(403).json({ error: 'Permission denied. Itinerary and user do not match.' });
      }

      const createTimeObject = (timeString: string) => {
        if (!timeString) return null;
      
        // Parse the OK this transit C ds DTC dates string as a UTC date
        const date = new Date(timeString);
            
        // Create a Firestore timestamp from the UTC date
        const timestamp = admin.firestore.Timestamp.fromDate(date);
      
        return { time: timestamp };
      };
      

      const startTimeObject = item.startTime ? createTimeObject(item.startTime) : null;
      const endTimeObject = item.endTime ? createTimeObject(item.endTime) : null;

      const updatedDescription = `${item.description || ''}`;

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
