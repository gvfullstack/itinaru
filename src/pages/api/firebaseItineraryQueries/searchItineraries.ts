import type { NextApiRequest, NextApiResponse } from 'next';
import dbServer from '../../../utils/firebase.admin'; 

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { searchTerm, lastDocId } = req.body;

        try {
            let query = dbServer.collection("itineraries")
                .orderBy("title")
                .startAt(searchTerm)
                .endAt(searchTerm + "\uf8ff")
                .limit(6);
          
            // If there's a lastDocId, adjust the query to start after it
            if (lastDocId) {
                const lastDoc = await dbServer.collection("itineraries").doc(lastDocId).get();
                query = query.startAfter(lastDoc);
            }

            const snapshot = await query.get();
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch data.' });
        }
    } else {
        return res.status(405).end(); // Method Not Allowed if not POST
    }
};
