import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:  process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp;

////ensures firebase initializes only when run on the browser//////
if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

let isFirebaseInitialized = false;

/////ensures firebase initializes only once//////
if (!isFirebaseInitialized) {
  firebase.initializeApp(firebaseConfig);
  isFirebaseInitialized = true;
}

export { firebaseApp };
