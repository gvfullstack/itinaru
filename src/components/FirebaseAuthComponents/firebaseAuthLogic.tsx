
import React, { useEffect, useRef } from "react";
import 'firebase/compat/analytics';
import firebase from "firebase/compat/app";
import 'firebaseui/dist/firebaseui.css';
import * as firebaseui from "firebaseui";
import { getFirebaseAuth
 } from "./config/firebase.auth";
import { db } from './config/firebase.database';
import { authUserState, privacySettingsState } from '../../atoms/atoms';
import { AuthenticatedUser } from '../typeDefs';
import { Timestamp } from 'firebase/firestore'; // Make sure to import Timestamp
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import the required functions
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';


const firebaseAuth = getFirebaseAuth();


export default function FirebaseAuthLogic () {
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [userPrivacySettings, setUserPrivacySettings] = useRecoilState(privacySettingsState);

  
    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            const uid = firebaseUser.uid;
      
            // Fetch additional user information from Firestore
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
      
            if (userDoc.exists()) {
              // Default user object
              const defaultUser: Partial<AuthenticatedUser> = {
                accountCreationDate: Timestamp.fromDate(new Date()),
                bio: null,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                profilePictureUrl: null,
              };
      
              // Separate privacySettings from the rest of the user fields
              const { privacySettings, ...userFields } = userDoc.data() || {};
      
              // Set authentication user state
              setAuthUser({
                uid: uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                ...defaultUser,
                ...userFields // Spread in the additional Firestore data
              } as AuthenticatedUser);
      
              // Set privacy settings state
              setUserPrivacySettings(privacySettings);
      
            } else {
              // Handle case where Firestore document doesn't exist
              // Create a new document with data from Firebase auth
              await setDoc(userRef, {
                uid: uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                // Add other fields as needed
              });
      
              // Update Recoil state
              setAuthUser({
                uid: uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                accountCreationDate: Timestamp.fromDate(new Date()),
                bio: null,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                profilePictureUrl: null,
                // Set other fields to null or default values as needed
              });

              setUserPrivacySettings({
                username: false,
                firstName: false,
                lastName: false,
                phoneNumber: false,
                email: false,
                bio: false,
                profilePictureUrl: false
              })
            }
          } else {
            // User is signed out
            setAuthUser(null);
          }
        });
      
        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
      }, []);
      
  
    return null; // Return null. component is only for useEffect handling
  }
  