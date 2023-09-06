import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import { firebaseApp } from './firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseApp);
  }
  
export const firebaseAnalytics = firebase.analytics();