import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyDq9qOEaGXGRjxqjp4vnVr_sg5HHai_OsQ",
  authDomain: "itinaru-6e85c.firebaseapp.com",
  projectId: "itinaru-6e85c",
  storageBucket: "itinaru-6e85c.appspot.com",
  messagingSenderId: "187346303841",
  appId: "1:187346303841:web:80d91d94bf7cce1f666320",
  measurementId: "G-N8B4BB2RHJ"
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
