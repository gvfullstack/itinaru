
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { firebaseApp } from './firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseApp);
  }
  
  const db = firebase.firestore();
  
  export { db };