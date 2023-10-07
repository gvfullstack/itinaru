import ItineraryEditForm from './EditItineraryFormComponents/itineraryEditForm';
import React, { useRef, useState, FC, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {currentlyEditingItineraryState} from './editFormAtoms';
import { Itinerary, ItinerarySettings, TimeObject, TransformedItineraryItem, TransformedItinerary, ItineraryItem} from './editFormTypeDefs'
import {useRecoilState, useRecoilCallback} from 'recoil';
import styles from './EditFormCSS/itineraryEditForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan, faPaperclip, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { authUserState } from '../../atoms/atoms'
// import { collection, doc, updateDoc, addDoc, deleteDoc, setDoc, Timestamp  } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db  } from '../FirebaseAuthComponents/config/firebase.database';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebaseStorage  } from '../FirebaseAuthComponents/config/firebase.storage';
import { ref, uploadBytesResumable, getDownloadURL  } from 'firebase/storage';
import pica from 'pica';
import Image from 'next/image';
import {myItinerariesResults} from '../MyItinerariesGallery/myItinerariesAtoms';
import {saveStatusDisplayedEditFormContainer} from './editFormAtoms';
import { v4 as uuidv4 } from 'uuid';
import { openDB } from 'idb';
import { validateTitle, validateCity, validateState } from './util/index'
import GoogleMapIframe from './directionsMapEF';

const GoogleMapsProvider = dynamic(() => 
    import('./EditFormITEMComponents/googleMapsProvider'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

const ItineraryItemForm = dynamic(() => 
    import('./EditFormITEMComponents/itineraryItemForm'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

const DragDropSection = dynamic(() =>
    import('./ItinItemDragDropSection/DragDropSection'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

    type Props = {
      mode?: "create" | "edit";
  }
  interface ChildComponentRef {
    handleFormSubmitCheck: () => boolean;
}


const EditFormContainer: FC<Props> = ({...props}) => {

const [showItemForm, setShowItemForm] = useState(false);
const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
const [authUser, setAuthUser] = useRecoilState(authUserState);
const [isSaving, setIsSaving] = useState(false);
const router = useRouter();
const [isFormValid, setFormValid] = useState(true);
const childRef = useRef<ChildComponentRef>(null);

const [itineraryGalleryPhotoUrl, setItineraryGalleryPhotoUrl] = useState('');
const [ItineraryGalleryPhotoFile, setItineraryGalleryPhotoFile] = useState<File | null>(null);
const [itineraryGalleryPhotoWhileEditing, setItineraryGalleryPhotoWhileEditing] = useState("");
const [imageSaved, setImageSaved] = useState("");
const [displayDeleteConfirmation, setDisplayDeleteConfirmation] = useState(false);
const [saveImageDisabled, setSaveImageDisabled] = useState(false);
const [processingImage, setProcessingImage] = useState(false);



useEffect(() => {
  if (authUser) {
    setItineraryGalleryPhotoUrl(itinerary.settings?.galleryPhotoUrl || '');
    setItineraryGalleryPhotoWhileEditing(itinerary.settings?.galleryPhotoUrl || '');
  }
},[]);


/////handle add of new Item to the Itinerary/////////
const addItemToRecoilState = () => {
    setItinerary((prevItinerary: Itinerary) => {
      const newItem: ItineraryItem = {
        id: uuidv4(),
        descHidden: true
      };
      const prevItems = prevItinerary.items || []; // Provide a fallback empty array
      return {
        ...prevItinerary,
        items: [...prevItems, newItem]
      };
    });
  };


const handleShowItemForm = () => {
    setShowItemForm(prev=>!showItemForm);
    if (!showItemForm) {
      addItemToRecoilState();
    }
}


// Check for authenticated user
function checkAuthenticatedUser(): boolean {
  if (!authUser || !authUser.uid) {
    console.error("No authenticated user found.");
    toast.warn("No authenticated user found.");
    return false;
  }
  return true;
}

// Check if itinerary ID exists
function checkItineraryId(): boolean {
  if (!itinerary.id) {
    console.error("Itinerary ID is missing. Cannot save.");
    toast.warn("Itinerary ID is missing. Cannot save.");
    return false;
  }
  return true;
}

// Upload gallery photo and return download URL
async function uploadGalleryPhoto(): Promise<string | null> {
  let downloadURL: string | null = null;
  if (ItineraryGalleryPhotoFile) {
    const storageRef = ref(firebaseStorage, `itineraries/${authUser?.uid}/${itinerary.id}/itineraryGalleryPhoto`);
    const uploadTask = itineraryGalleryPhotoWhileEditing !== "" ? uploadBytesResumable(storageRef, ItineraryGalleryPhotoFile) : null;

    if (uploadTask) {
      console.log("uploadTask")
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {}, // Empty function, you can implement progress monitoring here if desired
          (error) => {
            console.error('Upload failed:', error);
            toast.warn("An error occurred during photo upload.");
            reject(null);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(downloadURL, "downloadURL")
            setItinerary(prev => {
              if (typeof downloadURL === 'string') {
                return {...prev, 
                  settings: {...prev.settings, 
                    title: prev.settings?.title || "",
                    description: prev.settings?.description ||"",
                    city: prev.settings?.city || "",
                    state: prev.settings?.state || "",
                    visibility: prev.settings?.visibility || 'private',
                    galleryPhotoUrl: downloadURL}
                };
              }
              return prev;
            });
            setImageSaved("Saved");
            setSaveImageDisabled(true);
            setTimeout(() => {
              setImageSaved("");
            }, 3000);
            resolve(downloadURL);
          }
          );
      });
    }
  }

  return null;
}


const [saveStatus, setSaveStatus] = useRecoilState(saveStatusDisplayedEditFormContainer); // additional state for saving status

const handleEdit = async () => {
  const db = await openDB('itinerariesDatabase');
  const tx = db.transaction('myItineraries', 'readwrite');
  const store = tx.objectStore('myItineraries');
  await store.put(true, 'indexDBNeedsRefresh');
  await tx.done;
};

useEffect(() => {
  if(saveStatus === 'Restoring...') {
    setTimeout(() => {
      setSaveStatus('Session restored.');
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }, 3000);
    return;
  }  

  setSaveStatus('Saving...');
  // Clear any existing timers
  const timerId = setTimeout(() => {
    saveTransformedItinerary(); // Call your save function
    handleEdit();
  }, 5000);

  return () => {
    clearTimeout(timerId); // Clear the timer if 'itinerary' changes
  };
}, [itinerary]);


// Transform and save itinerary.  This is/should be the primary/only exit point for form data going to the database.//////////
async function saveTransformedItinerary() {
  // Initialize transformedItinerary with the same shape as TransformedItinerary, but empty values
  let transformedItinerary: TransformedItinerary = {
    id: itinerary.id,
    uid: itinerary.uid || "",
    settings: {
      title: "",
      description: itinerary.settings?.description || "",
      city: "",
      state: "",
      visibility: itinerary.settings?.visibility || "private",
      galleryPhotoUrl: itinerary.settings?.galleryPhotoUrl || ""
    },
    items: []
  };

  // Validate and populate fields...
  if (validateTitle(itinerary?.settings?.title ?? "")) {
    transformedItinerary.settings.title = itinerary?.settings?.title ?? "";
  }

  if (validateCity(itinerary?.settings?.city ?? "")) {
    transformedItinerary.settings.city = itinerary?.settings?.city?.toUpperCase() ?? ""; 
  }

  if (validateState(itinerary?.settings?.state ?? "")) {
    transformedItinerary.settings.state = itinerary?.settings?.state?.toUpperCase() || "";
  }
  // Map over itinerary items to transform the incompatible types
  transformedItinerary.items = (itinerary?.items ?? []).map(item => ({
    ...item,
    descHidden: true,
    startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },
    endTime: item.endTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.endTime.time.toDate()) } : { time: null },  
  }));

  console.log(transformedItinerary, "transformedItinerary")
  // Continue with DB logic as before
  const indexLocalDB = await openDB('itinerariesDatabase');
  const tx = indexLocalDB.transaction('itineraries', 'readwrite');
  const store = tx.objectStore('itineraries');
  await store.put(transformedItinerary, 'currentlyEditingItineraryStateEF');
  await tx.done;

  await db.collection('itineraries').doc(transformedItinerary.id).set(transformedItinerary);
  setSaveStatus('Saved');
  setTimeout(() => {
    setSaveStatus('');
  }, 3000);

}
        
const trashDelete = (
  <FontAwesomeIcon 
      icon={faTrashCan} 
      className={styles.trashIcon} 
      type="button" 
      onClick={()=>setDisplayDeleteConfirmation(true)}
  />
);

const attachIcon = (
  <FontAwesomeIcon 
      icon={faPaperclip} 
      className={styles.attachIcon} 
      type="button" 
      onClick={(e) => {
        e.preventDefault();
        inputFileRef.current?.click()
      }}
  />
);

const resetPhotoIcon = (
  <FontAwesomeIcon
      icon={faRotateLeft}
      className={styles.resetPhotoIcon}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setItineraryGalleryPhotoWhileEditing(prev=>itineraryGalleryPhotoUrl)
      }}
  />
);

async function checkDatabaseState(key: string) {
  // Get a handle to the already opened database
  const db = await openDB('itinerariesDatabase');

  // Retrieve the object from the 'itineraries' object store
  const tx = db.transaction('itineraries', 'readonly');
  const store = tx.objectStore('itineraries');
  const record = await store.get(key);

  console.log("Current state of the record:", record);

  await tx.done;
}

const handleDeleteItinerary = async (itineraryId: string) => {
  if (!itineraryId) {
    toast.warn("No itinerary ID provided.");
    return console.error("No itinerary ID provided.");
  }

  try {
    // First, attempt to delete the data in the external database.
    await deleteItinerary(itineraryId);
    toast.success("Itinerary deleted successfully!");
    router.push('/');
    // If successful, proceed to delete local IndexedDB data.
    const db = await openDB('itinerariesDatabase');
    const tx = db.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');

    const existingData = await store.get('currentlyEditingItineraryStateEF');
    if (existingData !== undefined) {
      await store.delete('currentlyEditingItineraryStateEF');
    }
    await tx.done;
    console.log(checkDatabaseState('currentlyEditingItineraryStateEF'))
    // If everything went well, show success message and reset state.
    
    setItinerary({
      uid: "",
      id: "",
      settings: {
        title: "",
        description: "",
        city: "",
        state: "",
        visibility: "private"
      },
      items: []
    });

  } catch (error) {
    // Handle any errors that might occur during deletion
    toast.error(`Error deleting itinerary. ${error}`);
    console.error("Error deleting itinerary:", error);
  }
  handleEdit();
}



const deleteItinerary = async (itineraryId: string): Promise<void> => {
  if (!authUser || !authUser.uid) {
    toast.warn("No authenticated user found.");
    console.error("No authenticated user found.");
    return;
  }

  const itineraryRef = db.collection('itineraries').doc(itineraryId);
  const imageExistsInState = itinerary?.settings?.galleryPhotoUrl;

  try {
    if (imageExistsInState) {
      const storageRef = firebase.storage().ref();
      const imagePath = `itineraries/${authUser.uid}/${itineraryId}/itineraryGalleryPhoto`;
      await storageRef.child(imagePath).delete();
    }
    
    await itineraryRef.delete();
    
    console.log("Itinerary successfully deleted!");
    toast.success("Itinerary successfully deleted!");
  } catch (error) {
    console.error("Error while deleting: ", error);
    toast.error("Error while deleting itinerary. Please try again later.");
  }
};


////////////////////////////////////////////////////////////////
const imageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) { // Check if a file is selected
    setSaveImageDisabled(false);
    setProcessingImage(true);
    setImageSaved("Unsaved Image");

    if (/^image\/(jpeg|png|gif)$/.test(file.type)) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        // This will set the selected image as the preview
        await setItineraryGalleryPhotoWhileEditing(event.target?.result as string);
        setProcessingImage(false);
      };

      reader.readAsDataURL(file); // Read the file as Data URL

      resizeImage(file, (resizedFile) => {
        if (resizedFile) {
          setItineraryGalleryPhotoFile(resizedFile);
        } else {
          toast.warn("An error occurred while processing the image.");
        }
      });

    } else {
      toast.warn("Please select a valid image file (JPEG, PNG, or GIF).");
      setItineraryGalleryPhotoWhileEditing(""); // Reset the URL if an invalid file type is selected
      e.target.value = '';
    }
  }
  // If user cancels file selection, no action is taken.
};


///////////////////////////////////////////////////////////////
const resizeImage = (file: File, callback: (result: File | null) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new window.Image();///used window because Image(); conflicts with next/image
    img.src = event.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const picaInstance = pica();

      // Set the max desired size
      const maxWidth = 2048; // Max width for the image
      const maxHeight = 2048; // Max height for the image

      let { width, height } = img;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      picaInstance.resize(img, canvas, {
        unsharpAmount: 40,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
      }).then(() => {
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            callback(resizedFile);
          } else {
            callback(null);
          }
        }, 'image/jpeg', 0.9); // You can adjust the compression quality here, e.g. 0.9 for higher quality
      });
    };
  };
};

////////////////////////////////////////////////////////////////////
const inputFileRef = useRef<HTMLInputElement>(null);

const removeImage = (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
  e.preventDefault();
  setItineraryGalleryPhotoWhileEditing("");
  setItineraryGalleryPhotoFile(null);
  if (inputFileRef.current) {
    inputFileRef.current.value = "";
  }
};
////////////////////////////
const deletePhotoIcon = (
  <FontAwesomeIcon
      icon={faTrashCan}
      className={styles.deletePhotoIcon}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        removeImage(e);
      }}
  />
);
////////////////////////////

return (
<div className={styles.EFPageContainer}>
  <p className={styles.saveStatusDisplayed}>{saveStatus}</p>

    {showItemForm && 
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <GoogleMapsProvider>
                <ItineraryItemForm 
                  handleShowItemForm={handleShowItemForm} 
                  mode="create"
                  initialItem={itinerary.items?.[itinerary.items.length - 1] ?? undefined}  // Pass the last item as a prop, or null if 'itinerary.items' is undefined
                  />
              </GoogleMapsProvider>
            </div>
          </div>   
          }

              <div className={styles.EFFormContainer}>
                  <ItineraryEditForm />
     
                  <label className={styles.profileLabel}>
                    <p className={styles.labelText}>Gallery Photo:</p>
                    {processingImage && <p style={{fontWeight:"500"}}>Processing...</p>}
                   {itineraryGalleryPhotoWhileEditing && 
                      <p style={{ margin:"0", padding:"0", textAlign:"center"}}>{imageSaved}</p>}                 

                    {itineraryGalleryPhotoWhileEditing != "" &&
                    <div>
                      <div className={styles.profilePicPreviewImageContainer}> 
                        <Image 
                            src={itineraryGalleryPhotoWhileEditing || ''} 
                            alt="No Image Selected" 
                            width={2048} // replace with actual image width
                            height={2048} // replace with actual image height
                            className={styles.profilePicturePreview}
                        />
                      </div>
                    </div>}
                      <input 
                        ref={inputFileRef}
                        className={styles.profileInput} 
                        type="file" 
                        accept="image/jpeg, image/png, image/gif" 
                        onChange={imageProcessing} 
                        style={{ display: "none" }} // Hide the input
                      />
                    <div className= {styles.EFPhotoAttachIconButtons}>
                        {attachIcon}
                        {resetPhotoIcon}                      
                        {itineraryGalleryPhotoWhileEditing != "" && 
                          <div>{deletePhotoIcon}</div>            
                        }
                        {itineraryGalleryPhotoWhileEditing != "" &&
                          <button
                          disabled={saveImageDisabled} 
                          onClick={uploadGalleryPhoto}
                          className={saveImageDisabled ? styles.saveSaveImageButtonDisabled : styles.saveSaveImageButton}
                          >Save Image</button>
                        }
                  </div>
                  </label>
                  <p className={styles.profilePictureMessage}>*Image uploads must be in JPEG, PNG, or GIF format.</p>
                  
                  <div className={styles.plusSignContainerEF}>
                    <div className={styles.plusSignEF} onClick={handleShowItemForm}>
                      <span className={styles.plusSignText}> itinerary item</span> + 
                    </div>
                  </div>
                  <DragDropSection />
              </div>
              <GoogleMapIframe />
              <div className={styles.saveOrCancelButtonSectionP}>
                  <div className = {styles.iconSectionContainerP}>                
                      <div className = {styles.formControlsIconContainerP}>                
                          {trashDelete}
                      </div>
                      <p className = {styles.formControlsIconTextP}>Delete Itinerary</p>
                  </div>            
              </div>

              {displayDeleteConfirmation &&
              <div className={styles.EFConfirmDeleteItinSection}>
                <p className={styles.confirmQ}>Are you sure you want to delete the entire Itinerary?</p>
                <div>
                  <button className={styles.cancelButton}
                  onClick={()=>setDisplayDeleteConfirmation(false)}
                  >Cancel</button>
                  <button className={styles.deleteButton}
                  onClick={()=>handleDeleteItinerary(itinerary.id?itinerary.id:"")}
                  >Yes, Delete Itinerary</button>
                </div>        
              </div>}
</div>
  );
};

export default EditFormContainer;
 