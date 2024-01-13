import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseAuthComponents/config/firebase.database';
import { useRecoilState } from 'recoil';
import { authUserState } from '../../atoms/atoms';
import styles from './UsernameUpdate.module.css';
import { useRouter } from 'next/router';

const UsernameUpdate = () => {
  const [username, setUsername] = useState('');
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };  

  const handleSaveUsername = async () => {
    if (authUser && authUser.uid) {
      const userRef = doc(db, 'users', authUser.uid);
      try {
        await updateDoc(userRef, { username, isNewUser: false });

        // Update the authUserState atom with the new username
        setAuthUser(prevAuthUser => {
          // Ensure prevAuthUser is not null before trying to update
          if (prevAuthUser === null) {
            // Handle this case appropriately - maybe return null or some default state
            return null;
          }
        
          return { ...prevAuthUser, username };
        });
        
        
        // Handle successful update (e.g., show a success message)
      } catch (error) {
        console.error('Error updating username:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{`Please select a username for ${authUser?.email}`}</h3>
        <input
          className={styles.inputField}
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <button className={styles.saveButton} onClick={handleSaveUsername}>Save</button>
      </div>
    </div>
  );
};

export default UsernameUpdate;
