import * as admin from 'firebase-admin';

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", error);
    // Handle error as appropriate for your production environment
  }
} else {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined.");
  // Handle error as appropriate for your production environment
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const dbServer = admin.firestore();

const authServer = admin.auth();

export { authServer };

export default dbServer;