import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirebaseAuth} from "../FirebaseAuthComponents/config/firebase.auth";
import styles from './PublicProfile.module.css';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReauthenticated: () => void;
}

export const ReauthModal: React.FC<Props> = ({ isOpen, onClose, onReauthenticated }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const reauthenticate = async () => {
    try {
        const firebaseAuth = getFirebaseAuth();
        const user = firebaseAuth.currentUser;
      
        if (user && user.email) {
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
          await user.reauthenticateWithCredential(credential);
          onReauthenticated();
          onClose();
          setErrorMessage(null); // Clear any previous errors
        } else {
          setErrorMessage("User is not authenticated or email is not available");
        }
      
      } catch (error) {
      console.log('Reauthentication failed', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <h2 className={styles.modalTitle}>Changes to email require reauthentication</h2>
      <input className={styles.passwordInput} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      <div className = {styles.buttonContainer}>
        <button className={styles.submitButton} onClick={reauthenticate}>Submit</button>
        <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
      </div>

    </div>
  );
};
