
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { firebaseApp } from './firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseApp);
  }
  
  const db = firebase.firestore();
  const Timestamp = firebase.firestore.Timestamp;

  
  export { db, Timestamp};