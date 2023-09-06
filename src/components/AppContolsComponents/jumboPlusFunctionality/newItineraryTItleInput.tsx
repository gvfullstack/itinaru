import React, { useState } from 'react';
import styles from './newItineraryTitleInput.module.css';
import { firebaseStorage  } from '../../FirebaseAuthComponents/config/firebase.storage';
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { collection, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from 'firebase/storage';
import pica from 'pica';
import { authUserState, privacySettingsState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { query, where, getDocs } from 'firebase/firestore';
import { property } from 'lodash';
import { useForm, Controller } from 'react-hook-form';


interface NewItineraryTitleInputProps {
  hideBox: () => void;
}

const NewItineraryTitleInput: React.FC<NewItineraryTitleInputProps> = (props) => {

  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [title, setTitle] = useState('');
  const MIN_TITLE_LENGTH = 1;
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  function validateTitle(title: string) {
    if (title.trim().length < 5 || title.trim().length > 100) {
        return "Title should be between 5 and 100 characters.";
    }
    if (!/^[A-Za-z0-9 ]+$/.test(title.trim())) {
        return "Title can only contain numbers, spaces, and letters.";
    }
    if (/^\s|\s$/.test(title)) {
        return "Title cannot start or end with a space.";
    }
    return true;
}

  const handleSave = async () => {
  
    setIsSaving(true);
    // Ensure there's an authenticated user
    if (!authUser || !authUser.uid) {
      console.error("No authenticated user found.");
      return;
    }
  
    const itineraryData = {
      title: title,
      uid: authUser.uid,
      visibility: "private",
    };
  
    try {
      // Reference to the 'itineraries' collection
      const itinerariesRef = collection(db, 'itineraries');
  
      // Add new itinerary data to Firestore
      const docRef = await addDoc(itinerariesRef, itineraryData);
  
    } catch (error) {
      console.error("Error saving itinerary:", error);
    }
    setIsSaving(false)
    props.hideBox();
  };
  
  const handleGoToItinerary = () => {
    // Logic to navigate or display itinerary
    console.log('Going to itinerary');
  };

  return (
    <div className={styles.boxContainer}>
        <input
            type="text"
            placeholder="Itinerary Title"
            {...register("title", {
                validate: value => validateTitle(value) || "Invalid title"
            })}
            className={styles.itineraryInput}
            disabled={isSaving}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className={styles.errorText}>{errors.title.message as string}</p>}
        <div className={styles.buttonContainer}>
            {isSaving ? (
                <span className={styles.savingAlert}>Saving...</span>
            ) : (
                <>
                    <button onClick={handleSubmit(handleSave)}
                    disabled={MIN_TITLE_LENGTH > title.length}
                    className={styles.saveButton}>Create</button>
                    <button onClick={handleSubmit(handleSave)} 
                    disabled={MIN_TITLE_LENGTH > title.length}
                    className={styles.goButton}>Create and go</button>
                </>
            )}
        </div>
    </div>
);
}

export default NewItineraryTitleInput;
