import { initializeApp } from 'firebase/app';
import { getAuth, 
    connectAuthEmulator, 
    signInWithEmailAndPassword } 
    from 'firebase/auth';
import { getAnalytics } 
    from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyDq9qOEaGXGRjxqjp4vnVr_sg5HHai_OsQ",
    authDomain: "itinaru-6e85c.firebaseapp.com",
    projectId: "itinaru-6e85c",
    storageBucket: "itinaru-6e85c.appspot.com",
    messagingSenderId: "187346303841",
    appId: "1:187346303841:web:80d91d94bf7cce1f666320",
    measurementId: "G-N8B4BB2RHJ"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);

import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export { firebaseApp, analytics };
