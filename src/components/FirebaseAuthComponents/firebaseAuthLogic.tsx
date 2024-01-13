import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import firebase from "firebase/compat/app";
import { useRecoilState } from 'recoil';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseAuth } from "./config/firebase.auth";
import { db } from './config/firebase.database';
import { authUserState } from '../../atoms/atoms';
import { AuthenticatedUser } from '../typeDefs';
import { is } from "date-fns/locale";

const firebaseAuth = getFirebaseAuth();

export default function FirebaseAuthLogic() {
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get the ID token
        const idToken = await firebaseUser.getIdToken();
        fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        console.log("FirebaseAuthLogic executed")
        // Identify user
        const uid = firebaseUser.uid;
        // Fetch user information from Firestore
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // User already exists in Firestore
          const userFields = userDoc.data() || {};
          const isNewUser = userFields.isNewUser ?? false;

          // Set authentication user state
          setAuthUser({
            ...userFields,
            isNewUser,
          } as AuthenticatedUser);

          if (isNewUser) {
            // Redirect new user to select username page
            router.push('/user/selectUserName');
          } 
          else if(
            sessionStorage.getItem('preLoginRouteIsLogin') === "true"){      
            router.push('/user/welcome'); // Default route for returning users
            sessionStorage.removeItem('preLoginRouteIsLogin');
          }
          else {
            router.push('/'); // Default route for returning users
            // Redirect returning user to a post-login page
          }
        } else {
          // Handle case where Firestore document doesn't exist
          // Create a new document with data from Firebase auth
          const accountCreationDate = Timestamp.fromDate(new Date());
          const defaultUser: Partial<AuthenticatedUser> = {
            uid,
            email: firebaseUser.email,
            userFirstLastName: firebaseUser.displayName,
            accountCreationDate,
            isNewUser: true, // Set isNewUser to true for new users
            isDeleted: false,
            bio: null, 
            username:"", 
            profilePictureUrl: null,
            privacySettings: {
              username: true,
              userFirstLastName: false,
              email: false,
              bio: false,
              profilePictureUrl: false,
              emailSearchable: false
            }
            // Add other fields as needed
          };          

          await setDoc(userRef, defaultUser, { merge: true });

          // Update Recoil state
          setAuthUser({
            ...defaultUser,
          } as AuthenticatedUser);

          // Redirect new user to select username page
          router.push('/selectUserName');
        }
      } else {
        // User is signed out
        setAuthUser(null);
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return null; // This component only handles useEffect logic
}
