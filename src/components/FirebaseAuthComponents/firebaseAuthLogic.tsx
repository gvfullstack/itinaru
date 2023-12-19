
import React, { useEffect, useRef } from "react";
import 'firebase/compat/analytics';
import firebase from "firebase/compat/app";
import 'firebaseui/dist/firebaseui.css';
import * as firebaseui from "firebaseui";
import { getFirebaseAuth
 } from "./config/firebase.auth";
import { db } from './config/firebase.database';
import { authUserState } from '../../atoms/atoms';
import { AuthenticatedUser } from '../typeDefs';
import { Timestamp } from 'firebase/firestore'; // Make sure to import Timestamp
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import the required functions
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { openDB } from 'idb'; 

const firebaseAuth = getFirebaseAuth();


export default function FirebaseAuthLogic () {
    const [authUser, setAuthUser] = useRecoilState(authUserState);

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {  
            
            // User is signed in, get the ID token
            const idToken = await firebaseUser.getIdToken();
            console.log("idToken:", idToken);
            document.cookie = `idToken=${idToken}; path=/; secure; httponly; samesite=strict`;

            //identify user
            const uid = firebaseUser.uid;
            // Fetch user information from Firestore
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
      
            if (userDoc.exists()) {
              // Default user object
       
      
              // spread user fields from Firestore document
              const { ...userFields } = userDoc.data() || {};
      
              // Set authentication user state
              setAuthUser({
                ...userFields, // Spread in the additional Firestore data,
                
              } as AuthenticatedUser);
      
              // Set privacy settings state
      
            } else {
              // Handle case where Firestore document doesn't exist
              // Create a new document with data from Firebase auth
              const accountCreationDate = Timestamp.fromDate(new Date());
              const defaultUser: Partial<AuthenticatedUser> = {
                accountCreationDate: Timestamp.fromDate(new Date()),
                isDeleted: false,
                bio: null,  
                profilePictureUrl: null,
                privacySettings:{
                  username: true,
                  userFirstLastName: false,
                  email: false,
                  bio: false,
                  profilePictureUrl: false,
                  emailSearchable: false
                }   

              };
              await setDoc(userRef, {
                uid: uid,
                email: firebaseUser.email,
                userFirstLastName: firebaseUser.displayName,
                accountCreationDate: accountCreationDate,
                ...defaultUser
                // Add other fields as needed
              }, { merge: true });
      
              // Update Recoil state
              setAuthUser((prevAuthUser) => ({
                ...defaultUser,         // Apply default values first
                ...prevAuthUser,        // Override with existing values
                uid: uid,               // Finally, apply new values
                email: firebaseUser.email,
                userFirstLastName: firebaseUser.displayName,
                accountCreationDate: accountCreationDate,
                bio: null,               
                profilePictureUrl: null,
              }));          
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
  