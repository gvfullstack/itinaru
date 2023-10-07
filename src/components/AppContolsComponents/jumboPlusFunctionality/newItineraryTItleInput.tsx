  import React, { useEffect, useState } from 'react';
  import styles from './newItineraryTitleInput.module.css';
  import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
  import { collection, addDoc, updateDoc } from 'firebase/firestore';
  import { authUserState } from '../../../atoms/atoms'
  import { useRecoilState} from 'recoil';
  import { useForm } from 'react-hook-form';
  import {currentlyEditingItineraryState} from '../../EditFormComponents/editFormAtoms';
  import { Itinerary, ItineraryItems} from './titleInputTypeDefs'
  import { useRouter } from 'next/router';
  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { openDB } from 'idb';

  interface NewItineraryTitleInputProps {
    hideBox: () => void;
  }

  const NewItineraryTitleInput: React.FC<NewItineraryTitleInputProps> = (props) => {

    const [authUser, setAuthUser] = useRecoilState(authUserState);
    // const [title, setTitle] = useState('');
    const MIN_TITLE_LENGTH = 1;
    const [isSaving, setIsSaving] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm();
    const title = watch("title", "");
    const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

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
        toast.error("No authenticated user found. Please log in and try again.");
        console.error("No authenticated user found.");
        return;
      }
    
      const itineraryData = {
        id: "",
        uid: authUser.uid,
        settings: {
          title: title,
          visibility: "private",
        }
      };
    
      try {
        // Reference to the 'itineraries' collection
        const itinerariesRef = collection(db, 'itineraries');
    
        // Add new itinerary data to Firestore
        const docRef = await addDoc(itinerariesRef, itineraryData);

        itineraryData.id = docRef.id;

    // Update Firestore document with the generated ID
        await updateDoc(docRef, { id: docRef.id });
        toast.success("Itinerary created successfully!");
        setIsSaving(false)
      return docRef;

      } catch (error) {
        console.error("Error saving itinerary:", error);
        toast.error("Error saving itinerary. Please try again.");
        return null
      }
      
    };
    
    const handleSimpleSave = async () => {
      const savedDocRef = await handleSave();
      if (savedDocRef) {
        props.hideBox();
      }
    };

    const handleCreateAndGo = async () => {
      setShowModal(true);
      
      const savedDocRef = await handleSave();
    
      if (!savedDocRef) {
        console.error("Unable to get the saved document reference.");
        setShowModal(false);
        return;
      }
    
      const itineraryId = savedDocRef.id;

      if (typeof authUser?.uid !== 'string') {
        throw new Error("UID is not a string or is missing");
     }
      setItinerary({
        id: itineraryId,
        uid: authUser.uid,
        settings: {
          title: title,
          description: "",
          city: "",
          state: "",
          visibility: "private",
        },
        items: []
      });

      const indexDB = await openDB('itinerariesDatabase');
      const tx = indexDB.transaction('itineraries', 'readwrite');
      const store = tx.objectStore('itineraries');
      await store.put(itinerary, 'currentlyEditingItineraryStateEF');
      await tx.done;
      
      router.push(`/editItinerary/editMyItinerary`);

    };

    useEffect(() => {
      // Function to run when the route changes
      const handleRouteChange = () => {
        props.hideBox(); // Hide the box
        setShowModal(false); // Close the modal
      };
    
      // Add the route change event
      router.events.on('routeChangeComplete', handleRouteChange);
    
      // Clean up by removing the event listener when the component unmounts
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router]);

    return (
      
      <div className={styles.boxContainer}>            
          <p className={styles.heading}>New Itinerary</p>
          <form className={styles.formElement}>
          <input
              type="text"
              placeholder="Itinerary Title"
              {...register("title", {
                  validate: value => validateTitle(value) || "Invalid title"
              })}
              className={styles.itineraryInput}
              disabled={isSaving}
          />
          {errors.title && <p className={styles.errorText}>{errors.title.message as string}</p>}
          <div className={styles.buttonContainer}>
              {isSaving ? (
                  <span className={styles.savingAlert}>Saving...</span>
              ) : (
                  <>
                      <button 
                      type="button"
                      onClick={handleSubmit(handleSimpleSave)}
                      disabled={!title || MIN_TITLE_LENGTH > title.length}
                      className={styles.saveButton}>Create</button>
                      <button 
                      type="button"
                      onClick={handleSubmit(handleCreateAndGo)} 
                      disabled={!title || MIN_TITLE_LENGTH > title.length}
                      className={styles.goButton}>Create and go</button>
                  </>
              )}
          </div>
          </form>
          { showModal &&
          <div className={styles.modalOverlay}>
              <div className={styles.modal}>
              saving...
              </div>
              <div className={styles.spinner}></div>

          </div>
          }
      </div>
  );}

  export default NewItineraryTitleInput;
