import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseApp } from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseApp);
}

export const firebaseAuth = firebase.auth();

export const logout = () => {
  return firebaseAuth.signOut();


};

export const getFirebaseAuth = () => firebase.auth();
