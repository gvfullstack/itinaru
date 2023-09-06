import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { firebaseApp } from './firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseApp);
  }
  
  const firebaseStorage = firebase.storage();
  
  export { firebaseStorage };