import type { NextApiRequest, NextApiResponse } from 'next';
import { authServer } from '@/utils/firebase.admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { idToken } = req.body;
    // Verify ID token using authServer
    const decodedToken = await authServer.verifyIdToken(idToken);

    // Set HttpOnly cookie
    res.setHeader('Set-Cookie', `idToken=${idToken}; Path=/; HttpOnly; Secure; SameSite=Strict`);

    // Send response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
