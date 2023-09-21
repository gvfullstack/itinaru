import ItineraryEditForm from './EditItineraryFormComponents/itineraryEditForm';
import React, { useRef, useState, FC, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {currentlyEditingItineraryState} from './editFormAtoms';
import { Itinerary, ItinerarySettings, TimeObject, TransformedItineraryItem, TransformedItinerary} from './editFormTypeDefs'
import {useRecoilState, useRecoilCallback} from 'recoil';
import styles from './EditFormCSS/itineraryEditForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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

useEffect(() => {
  if (authUser) {
    setItineraryGalleryPhotoUrl(itinerary.settings.galleryPhotoUrl || '');
    setItineraryGalleryPhotoWhileEditing(itinerary.settings.galleryPhotoUrl || '');
  }
},[]);

const handleShowItemForm = () => {
    setShowItemForm(prev=>!showItemForm);
}

const cancelMark = 
        <FontAwesomeIcon 
            icon={faXmark} 
            className={styles.cancelMark}
            type="button"
            onClick={handleCancel}
        />
  function handleCancel(): void {
    toast.info("Canceled. UNSAVED changes discarded.");
    router.push('/');
    setItinerary(
      {
        uid: "",
        id: "",  
        settings: {
          title: "",
          description: "",
          city: "",
          state: "",
          visibility: "private" // or any other default value
        },
        items: []
      })
  }
const floppyDiskAddSave = (
    <FontAwesomeIcon 
        icon={faFloppyDisk as any} 
        className={styles.floppyDisk} 
        type="button" 
        onClick={saveItinerary}
    />
);

// Main saveItinerary function
async function saveItinerary(): Promise<void> {
  if (!checkFormValid() || !checkAuthenticatedUser() || !checkItineraryId()) {
    console.log("form submission failed");
    return;
  }
  
  let downloadURL: string | null = null;

  if (ItineraryGalleryPhotoFile) {
    downloadURL = await uploadGalleryPhoto();
    if (downloadURL === null) {
      toast.warn("An error occurred during photo upload.");
      return;
    }
  }

  await saveTransformedItinerary(downloadURL);
}

function checkFormValid(): boolean {
  if (childRef.current) {
    const isFormValid = childRef.current.handleFormSubmitCheck();
    if (!isFormValid) {
      toast.warn("Please correct all errors before submitting.");
      return false;
    }
  }
  return true;
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
  const storageRef = ref(firebaseStorage, `itineraries/${authUser?.uid}/${itinerary.id}/itineraryGalleryPhoto`);
  const uploadTask = itineraryGalleryPhotoWhileEditing !== "" ? uploadBytesResumable(storageRef, ItineraryGalleryPhotoFile!) : null;
  if (uploadTask) {
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.error('Upload failed:', error);
          reject(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }
  return null;
}

// Transform and save itinerary
async function saveTransformedItinerary(downloadURL: string | null) {
  let transformedItinerary: TransformedItinerary = {
    ...itinerary,
    items: itinerary.items.map(item => ({
      ...item,
      startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : { time: null },
      endTime: item.endTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.endTime.time.toDate()) } : { time: null },
    })),
    settings: {
      ...itinerary.settings,
    }
  };

  if (downloadURL) {
    transformedItinerary.settings = { 
      ...transformedItinerary.settings,
      galleryPhotoUrl: downloadURL
    };
  }

  const itineraryRef = db.collection('itineraries').doc(itinerary.id);
  return itineraryRef.set(transformedItinerary)
    .then(() => {
      toast.success("Itinerary successfully saved!");
      console.log("Itinerary successfully saved!");
      router.push('/');
    })
    .catch((error: any) => {
      console.error("Error saving itinerary: ", error);
    });
}



        
const trashDelete = (
  <FontAwesomeIcon 
      icon={faTrashCan} 
      className={styles.trashIcon} 
      type="button" 
      onClick={()=>handleDeleteItinerary(itinerary.id?itinerary.id:"")}
  />
);

const handleDeleteItinerary = async (itineraryId: string) => {
  if (!itineraryId) {
    toast.warn("No itinerary ID provided.");
    return console.error("No itinerary ID provided.");
  }

  try {
    // Assuming deleteItinerary is an async function that interacts with a database
    await deleteItinerary(itineraryId);

    // Display a toast notification
    toast.success("Itinerary deleted successfully!");

    router.push('/');
    setItinerary({
      uid: "",
      id: "",
      settings: {
        title: "",
        description: "",
        city: "",
        state: "",
        visibility: "private" // or any other default value
      },
      items: []
    });
  } catch (error) {
    // Handle any errors that might occur during deletion
    toast.error(`Error deleting itinerary. ${error}`);
    console.error("Error deleting itinerary:", error);
  }
}


function deleteItinerary(itineraryId: string): void {
  if (!authUser || !authUser.uid) {
    toast.warn("No authenticated user found.");
    console.error("No authenticated user found.");
    return;
  }

  const itineraryRef = db.collection('itineraries').doc(itineraryId);

  itineraryRef.delete()
      .then(() => {
          console.log("Itinerary successfully deleted!");
      })
      .catch((error) => {
          console.error("Error removing itinerary: ", error);
      });
}



////////////////////////////////////////////////////////////////
const imageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && /^image\/(jpeg|png|gif)$/.test(file.type)) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      // This will set the selected image as the preview
      setItineraryGalleryPhotoWhileEditing(event.target?.result as string);
    };

    reader.readAsDataURL(file); // Read the file as Data URL

    resizeImage(file, (resizedFile) => {
      if (resizedFile) {
        setItineraryGalleryPhotoFile(resizedFile);
      } else {
        alert('An error occurred while processing the image.');
      }
    });
    
  } else {
    alert('Please select a valid image file (JPEG, PNG, or GIF).');
    setItineraryGalleryPhotoWhileEditing(""); // Reset the URL if an invalid file type is selected
    e.target.value = '';
  }
};

///////////////////////////////////////////////////////////////
const resizeImage = (file: File, callback: (result: File | null) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
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

const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  setItineraryGalleryPhotoWhileEditing("");
  setItineraryGalleryPhotoFile(null);
  if (inputFileRef.current) {
    inputFileRef.current.value = "";
  }
};
////////////////////////////

return (
<div className={styles.EFPageContainer}>

    {showItemForm && 
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              {/* <GoogleMapsProvider>
                <ItineraryItemForm 
                  handleShowItemForm={handleShowItemForm} 
                  mode="create"
                    />
              </GoogleMapsProvider> */}
            </div>
          </div>   
          }

          <div className={styles.saveOrCancelButtonSectionP}>
            <div className = {styles.iconSectionContainerP}>                
                <div className = {styles.formControlsIconContainerP}>                
                    {trashDelete}
                </div>
                <p className = {styles.formControlsIconTextP}>Delete</p>
            </div>
            <div className = {styles.iconSectionContainerP}>                
                <div className = {styles.formControlsIconContainerP}>                
                    {floppyDiskAddSave}
                </div>
                <p className = {styles.formControlsIconTextP}>Save</p>
            </div>

            <div className = {styles.iconSectionContainerP}>                
                <div className = {styles.formControlsIconContainerP}>                
                    {cancelMark}
                </div>
                <p className = {styles.formControlsIconTextP}>Cancel</p>
            </div>            
        </div>
   

              <div className={styles.EFFormContainer}>
                  <ItineraryEditForm 
                    handleShowItemForm={handleShowItemForm}
                    ref={childRef}
                    />
     
                    <label className={styles.profileLabel}>
                      <p>Gallery Photo:</p>
                      {itineraryGalleryPhotoWhileEditing != "" &&
                      <div>
                        <div className={styles.profilePicPreviewImageContainer}>
                          <img src={itineraryGalleryPhotoWhileEditing || ''} alt="No Image Selected"
                          className={styles.profilePicturePreview} />
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
                      <div>
                      {itineraryGalleryPhotoWhileEditing != "" && <button 
                        className={styles.editPhotoButtons}
                          onClick={removeImage}>Remove
                        </button> }
                        <button 
                        className={styles.editPhotoButtons}
                        onClick={(e) =>  {e.preventDefault();
                            inputFileRef.current?.click()}}>
                              Add New
                        </button>
                        <button 
                        className={styles.editPhotoButtons}
                        onClick={(e) =>  {e.preventDefault();
                            setItineraryGalleryPhotoWhileEditing(prev=>itineraryGalleryPhotoUrl)}}>
                              Reset
                        </button>
                        
                      </div>
                    </label>
                    <p className={styles.profilePictureMessage}>*Image uploads must be in JPEG, PNG, or GIF format.</p>
                  
                  <div className={styles.plusSignContainerEF}>
                    <div className={styles.plusSignEF} onClick={handleShowItemForm}>
                      <span className={styles.plusSignText}> itinerary item</span> + 
                    </div>
                  </div>
                  <DragDropSection />
                  <button onClick={()=>console.log(itineraryGalleryPhotoWhileEditing)}>print</button>
              </div>
    
</div>
  );
};

export default EditFormContainer;
 