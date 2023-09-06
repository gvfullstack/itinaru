import React, { useEffect, useRef } from "react";
import 'firebase/compat/analytics';
import firebase from "firebase/compat/app";
import 'firebaseui/dist/firebaseui.css';
import * as firebaseui from "firebaseui";
import { firebaseAuth } from "./config/firebase.auth";
import { db } from './config/firebase.database';
import { authUserState } from '../../atoms/atoms';
import { AuthenticatedUser } from '../typeDefs';
import { Timestamp } from 'firebase/firestore'; // Make sure to import Timestamp
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import the required functions
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';




const Login: React.FC = () => {
  const router = useRouter();
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const uiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this code runs only on the client (browser)
    if (typeof window !== 'undefined') {
      const uiConfig = {
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Add more options as per your requirements
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => {            
          const postLoginRoute = sessionStorage.getItem('preLoginRoute');
          console.log("postLoginRoute: ", postLoginRoute);
          if (postLoginRoute) {
            router.push(postLoginRoute);
          } else {
            router.push('/');  // Default route in case the stored route is not available.
          }
          return false;
          },
          // No need for window.open if you want to navigate directly
          tosCallback: () => { router.push("/termsOfUse"); },
          privacyPolicyCallback: () => { router.push("/privacyPolicy"); }
        }
      };

      if (uiRef.current !== null) {
        let ui = firebaseui.auth.AuthUI.getInstance(firebaseAuth.app.name);
        if (!ui) {
          ui = new firebaseui.auth.AuthUI(firebaseAuth);
        }
        
        setTimeout(() => {
          if (uiRef.current !== null && ui) {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
              if(uiRef.current !== null && ui){
              ui.start(uiRef.current, uiConfig);}
            });
          }
        }, 1100);
      }

      return () => {
        if (uiRef.current && uiRef.current.firstChild) {
          uiRef.current.firstChild.remove();
        }
      };
    }
  }, [authUser]);

  return <div ref={uiRef} />;
};

export default Login;
