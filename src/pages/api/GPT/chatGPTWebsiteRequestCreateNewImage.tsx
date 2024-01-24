import { storageServer } from "../../../utils/firebase.admin"; 
import { NextApiRequest, NextApiResponse } from 'next';

export default async function uploadItineraryImageHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { itineraryId, image } = req.body; // Assuming image is received as a file/blob

      const imageRef = storageServer.bucket().file(`itineraries/${itineraryId}/${itineraryId}`);
      await imageRef.createWriteStream().end(image);
      const galleryPhotoUrl = await imageRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });

      res.status(200).json({ message: "Image uploaded successfully", galleryPhotoUrl: galleryPhotoUrl });
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
