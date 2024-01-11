import ItineraryEditForm from './EditItineraryFormComponents/itineraryEditForm';
import React, { useRef, useState, FC, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import {currentlyEditingItineraryState, itineraryAccessItinView} from './editFormAtoms';
import { Itinerary, ItinerarySettings, TimeObject, TransformedItineraryItem, TransformedItinerary, ItineraryItem} from './editFormTypeDefs'
import {useRecoilState, useRecoilCallback} from 'recoil';
import styles from './EditFormCSS/itineraryEditForm.module.css';
import {DynamicFontAwesomeIcon} from '@/components';
import { faTrashCan, faPaperclip, faRotateLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { authUserState } from '../../atoms/atoms'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db  } from '../FirebaseAuthComponents/config/firebase.database';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebaseStorage  } from '../FirebaseAuthComponents/config/firebase.storage';
import { ref, uploadBytesResumable, getDownloadURL, list  } from 'firebase/storage';
import pica from 'pica';
import Image from 'next/image';
import {saveStatusDisplayedEditFormContainer,itineraryInEditNeedsDeletionFromRecoilState} from './editFormAtoms';
import { v4 as uuidv4 } from 'uuid';
import { openDB } from 'idb';
import { validateTitle, validateCity, validateState } from './util/index'
import GoogleMapIframe from './directionsMapEF';
import Link from 'next/link'; 
import {currentlyViewingItineraryState} from '../PublicItineraryViewComponents/publicItinViewAtoms';
import { set } from 'lodash';
import SharingModal from './EditFormShareFunctionality/EFshareContainer';
import {fetchSharedItinerariesItinView} from './EditFormShareFunctionality/utils/fetchSharedItinerariesItinView'
import {useUpdateItineraryAccess} from './util/updateUserAccess';
import {createPreviousTransformedItinerary} from './util/createPreviousTransformedItinerary';
import {createCurrentTransformedItinerary} from './util/createCurrentTransformedItinerary';
import {saveUpdatedFields} from './util/saveUpdatedFields';
import { markItineraryAndItemsAsDeleted } from './util/markItineraryAndItemsAsDeleted';
import {myItinerariesResults} from '../MyItinerariesGallery/myItinerariesAtoms';
import {serverTimestamp } from 'firebase/firestore'

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
const [itineraryInEditNeedsDeletionFromRecoil, setItineraryInEditNeedsDeletionFromRecoilState] = useRecoilState<boolean>(itineraryInEditNeedsDeletionFromRecoilState);
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
const [currentlyViewingItinerary, setCurrentlyViewingItinerary] = useRecoilState(currentlyViewingItineraryState);
const [showSharingModal, setShowSharingModal] = useState(false);
const [itinAccessList, setItinAccessList] = useRecoilState(itineraryAccessItinView);
const [myItineraries, setMyItineraries] = useRecoilState(myItinerariesResults);

useEffect(() => {
  if(authUser && authUser.uid ) {
    setItineraryGalleryPhotoUrl(itinerary.settings?.galleryPhotoUrl || '');
    setItineraryGalleryPhotoWhileEditing(itinerary.settings?.galleryPhotoUrl || '');
  }
},[itinerary]);

  ///////////////////////////'''''''''''''''''''''''''''''''''''''''''''''
    const [previousTransformedItineraryNeedsUpdate, setPreviousTransformedItineraryNeedsUpdate] = useState(false);

  
    const handleSaveItineraryItem = async () => {

      //ensure all changes are saved before attempting to add an item
      if (timerId) {
        clearTimeout(timerId);
        timerId = undefined; // Reset the timerId
      }
      await saveItineraryToFirestore();

      // Firestore logic to add item to Firestore and retrieve the ID of the new item
      const itemsRef = db.collection('itineraries').doc(itinerary.id).collection('items');
      const docRef = await itemsRef.add({
        // Add other fields as necessary
        descHidden: true,
        itineraryParentId: itinerary.id,
        isDeleted: false,
        creationTimestamp: serverTimestamp(),
        lastUpdatedTimestamp: serverTimestamp(),
      });


      // Await is used to ensure we get the docRef before proceeding
      const newItem = {
        id: docRef.id,
        descHidden: true,
        itineraryParentId: itinerary.id,
        isDeleted: false,
        // Add other default fields or those returned by Firestore as necessary
      };
      // Now, update the Recoil state with the new item
      setItinerary((prevItinerary) => {
        const prevItems = prevItinerary.items || []; // Provide a fallback empty array
        return {
          ...prevItinerary,
          items: [...prevItems, newItem]
        };
      });

      setPreviousTransformedItineraryNeedsUpdate(true);

    };
  
    //to ensure previousTransformedItinerary only updates after itinerary state has completed updating. 
    useEffect(() => {
      if (previousTransformedItineraryNeedsUpdate) {
        const transformed = createPreviousTransformedItinerary(itinerary);
        setPreviousTransformedItinerary(transformed);
        setPreviousTransformedItineraryNeedsUpdate(false); // Reset the flag
      }
    }, [previousTransformedItineraryNeedsUpdate, itinerary]); 
    
  ///////////////////////////'''''''''''''''''''''''''''''''''''''''''''''

const handleSaveItemAndShowItemForm = async () => {
  if (!showItemForm) {
    await handleSaveItineraryItem();
  }
    setShowItemForm(prev=>!showItemForm);
   
}


// Check for authenticated user
function checkAuthenticatedUser(): boolean {
  if (!authUser || !authUser.uid) {
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
  checkAuthenticatedUser()
  let downloadURL: string | null = null;
  if (ItineraryGalleryPhotoFile && authUser?.uid && itinerary.id) {
    const path = `itineraries/${authUser?.uid}/${itinerary.id}/itineraryGalleryPhoto` ?? "";
    if (!firebaseStorage) {
      console.error('firebaseStorage is undefined');
      return null;
    }
    const storageRef = ref(firebaseStorage, path);
    const uploadTask = itineraryGalleryPhotoWhileEditing !== "" ? uploadBytesResumable(storageRef, ItineraryGalleryPhotoFile) : null;

    if (uploadTask) {
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
  } else {
    // Handling the case where required conditions are not met
    console.error("Required conditions not met for uploading gallery photo.");
    toast.warn("Could not upload the photo due to missing information.");
    return null;
  }

  return null;
}


const [saveStatus, setSaveStatus] = useRecoilState(saveStatusDisplayedEditFormContainer); // additional state for saving status

const renderCount = useRef(0);

useUpdateItineraryAccess({itinerary})

const [previousTransformedItinerary, setPreviousTransformedItinerary] = useState<TransformedItinerary>(/* initial state */);

useEffect(() => {
  const transformed = createPreviousTransformedItinerary(itinerary);
  setPreviousTransformedItinerary(transformed);
}, []);

let timerId: NodeJS.Timeout | undefined;
useEffect(() => {
  console.log("itinerary changed", itinerary)
  if (!checkAuthenticatedUser()) {
    return;
  }
  
  if (saveStatus === 'Loading...') {
    setTimeout(() => {
      setSaveStatus('Session loaded.');
      saveItineraryToFirestore(); //exits to saveItineraryToFirestore to evaluate if the currentlyEditingItinerary has been reset
      setTimeout(() => {
        setSaveStatus('');
      }, 1000);
    }, 1000);
    return;
  }

  setSaveStatus('Saving...');
  timerId = setTimeout(() => {
    saveItineraryToFirestore();
    // saveTransformedItinerary();
    // setIndexDBNeedsRefreshTrue();
    setMyItineraries([])
  }, 5000);

  return () => {
    clearTimeout(timerId);
  };
}, [itinerary]);


async function saveItineraryToFirestore() {
  let defaultItinerary: TransformedItinerary = {isDeleted: false, id: '', uid: "", settings: {title: "", description: "", city: "", state: "", visibility: "private", galleryPhotoUrl: "", keywords:""},items:[]}
  // Initialize transformedItinerary with the same shape as TransformedItinerary, but empty values
  let originalTransformedItinerary = previousTransformedItinerary ?? defaultItinerary
  console.log('originalTransformedItinerary', originalTransformedItinerary);
  let updatedTransformedItinerary = createCurrentTransformedItinerary(itinerary);
  console.log('updatedTransformedItinerary', updatedTransformedItinerary);
  ///save to external DB/firestore
  if(!originalTransformedItinerary?.id || 
    originalTransformedItinerary?.id !== updatedTransformedItinerary?.id) { // If the IDs do not match it means the currentlyEditingItinerary did not reset before page loaded for the new itinerary. 
    setPreviousTransformedItinerary(updatedTransformedItinerary);
    setSaveStatus('Loaded');
    setTimeout(() => {
      setSaveStatus('');
    }, 3000);
    return
  }

  if (originalTransformedItinerary?.id) {
    // Now it's safe to call saveUpdatedFields    
    await saveUpdatedFields(originalTransformedItinerary, updatedTransformedItinerary);
  } else {
    console.warn('previousTransformedItinerary is not ready. ID is missing.');
  }
  ///save to local DB
  const indexLocalDB = await openDB('itinerariesDatabase');
  const tx = indexLocalDB.transaction('itineraries', 'readwrite');
  const store = tx.objectStore('itineraries');
  await store.put(updatedTransformedItinerary, `currentlyEditingItineraryStateEF_${authUser?.uid}`);
  await tx.done;

  setPreviousTransformedItinerary(updatedTransformedItinerary);

  setSaveStatus('Saved');
  setTimeout(() => {
    setSaveStatus('');
  }, 3000);
}


const trashDelete = (
  <DynamicFontAwesomeIcon 
      icon={faTrashCan} 
      className={styles.trashIcon} 
      type="button" 
      onClick={()=>setDisplayDeleteConfirmation(true)}
  />
);
const floppySave = (
  <DynamicFontAwesomeIcon 
      icon={faFloppyDisk} 
      className={styles.floppyDisk} 
      type="button" 
      onClick={async ()=> {
        saveItineraryToFirestore();
        // await setIndexDBNeedsRefreshTrue();
        setMyItineraries([])
        router.push('/user/myItineraries');
      }
        }
  />
);


const attachIcon = (
  <DynamicFontAwesomeIcon 
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
  <DynamicFontAwesomeIcon
      icon={faRotateLeft}
      className={styles.resetPhotoIcon}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setItineraryGalleryPhotoWhileEditing(prev=>itineraryGalleryPhotoUrl)
      }}
  />
);

const addContributorIcon = (
  <DynamicFontAwesomeIcon
      icon={faUserPlus}
      className={styles.addContributorIcon}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        handleShowSharingModal();
      }}
  />
)


const handleDeleteItinerary = async (itineraryId:string) => {
  try {
    if(authUser && authUser.uid) {
    await markItineraryAndItemsAsDeleted(itineraryId, authUser);

    router.push('/user/myItineraries');
    // If successful, proceed to delete local IndexedDB data.
    const db = await openDB('itinerariesDatabase');
    const tx = db.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');

    const existingData = await store.get(`currentlyEditingItineraryStateEF_${authUser?.uid}`);
    if (existingData !== undefined) {
      await store.delete(`currentlyEditingItineraryStateEF_${authUser?.uid}`);
    }
    await tx.done;

    // setIndexDBNeedsRefreshTrue();
    setMyItineraries([])
    setItineraryInEditNeedsDeletionFromRecoilState(true);

    toast.success("Itinerary and associated data marked as deleted!");}
    // Further cleanup or state updates
  } catch (error:any) {
    toast.error(`Error: ${error.message}`);
    console.error("Error:", error);
  }
};


const deleteImage = async (itineraryId: string): Promise<void> => {
  if (!authUser || !authUser.uid) {
    toast.warn("No authenticated user found.");
    console.error("No authenticated user found.");
    return;
  }

  const imageExistsInState = itinerary?.settings?.galleryPhotoUrl;

  try {
    if (imageExistsInState) {
      const storageRef = firebase.storage().ref();
      const imagePath = `itineraries/${authUser.uid}/${itineraryId}/itineraryGalleryPhoto`;
      await storageRef.child(imagePath).delete();
    }
  }catch (error) {
    console.error("Error while deleting: ", error);
    toast.error("Error while deleting itinerary. Please try again later.");
  }
}

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

const removeImage = async (e: React.MouseEvent<HTMLElement | SVGSVGElement>)  => {
  e.preventDefault();
  setItineraryGalleryPhotoWhileEditing("");
  setItineraryGalleryPhotoFile(null);
  if (inputFileRef.current) {
    inputFileRef.current.value = "";
  }

  await deleteImage(itinerary.id?itinerary.id:"");
  
  setItinerary(prev => {
    return {...prev, 
      settings: {...prev.settings, 
        title: prev.settings?.title || "",
        description: prev.settings?.description ||"",
        city: prev.settings?.city || "",
        state: prev.settings?.state || "",
        visibility: prev.settings?.visibility || 'private',
        galleryPhotoUrl: ""}
    };
  })
};
////////////////////////////
const deletePhotoIcon = (
  <DynamicFontAwesomeIcon
      icon={faTrashCan}
      className={styles.deletePhotoIcon}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        removeImage(e);
      }}
  />
);
///////////////preview itinerary function/////////////

const handlePreviewItinerary = () => {
  if (!checkAuthenticatedUser()) {
    return;
  }

  if (!checkItineraryId()) {
    return;
  }
 setCurrentlyViewingItinerary(itinerary);
};

/////////sharing modal functions/////////////////////
const handleShowSharingModal = () => {
  setShowSharingModal(prev => true);

  const fetchData = async () => {
    const fetchedAccessList = await fetchSharedItinerariesItinView(itinerary.id || '');

    if (fetchedAccessList !== undefined) {
      setItinAccessList(prevList => {
        const newItems = fetchedAccessList.filter(fetchedItem =>
          !prevList.some(prevItem => prevItem.itineraryId === fetchedItem.itineraryId && prevItem.uid === fetchedItem.uid)
        );
        return [...prevList, ...newItems];
      });
    }
  };
  // Fetch data only if the condition is not met
  if (!itinAccessList.some(item => item.itineraryId === itinerary.id)) {
    fetchData();
  }

};

const handleCloseModal = () => {
  setShowSharingModal(prev => false);}

const navigateToParentItinerary = () => {
  if (itinerary?.derivedFromItineraryId) {
    router.push(`/viewItinerary/${itinerary.derivedFromItineraryId}`);
  }
};

function handleRemoveItem() {
  const items = itinerary.items;
  if (!items || items.length === 0) return [];
  // Create a new array without the last item
  const newItemsArray = items.slice(0, -1);

  setItinerary(prev => {
    return {
      ...prev,
      items: newItemsArray
    };
  });
}


return (
<div className={styles.EFPageContainer}>
  <p className={styles.saveStatusDisplayed}>{saveStatus}</p>

    {showItemForm && 
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <GoogleMapsProvider>
                <ItineraryItemForm 
                  handleRemoveClick={handleRemoveItem} 
                  handleShowItemForm={handleSaveItemAndShowItemForm} 
                  mode="create"
                  initialItem={itinerary.items?.[itinerary.items.length - 1] ?? undefined}  // Pass the last item as a prop, or null if 'itinerary.items' is undefined
                  />
              </GoogleMapsProvider>
            </div>
          </div>   
          }
      {showSharingModal && 
          <SharingModal viewHideModal={handleCloseModal}/>
          }

            <div className={styles.EFFormContainer}>
              {itinerary?.derivedFromItineraryId && (
                  <p className={styles.derivedFromItineraryText}>
                  Derived from a copy of {' '}
                  <span 
                      className={styles.linkStyle} // Add styles to make it look like a link
                      onClick={navigateToParentItinerary}
                  >
                      {itinerary.derivedFromItineraryId}
                  </span>
                  </p>
              )}
              <div className={styles.EFpageTopNav}>
                 <div className={styles.topNavGenericDiv}></div>
                  <Link className={styles.previewLink} href="/viewItinerary/previewItinerary" 
                  onClick={handlePreviewItinerary}>Preview</Link>
                  <div className={styles.addContributorIconContainer} >
                    {addContributorIcon}          
                  </div>
              </div>
              <label className={styles.profileLabel}>
                    <p className={styles.labelText}>Gallery Photo:</p>
                    {processingImage && <p style={{fontWeight:"500"}}>Processing...</p>}
                   {itineraryGalleryPhotoWhileEditing && 
                      <p style={{ margin:"0", padding:"0", textAlign:"center"}}>{imageSaved}</p>}                 

                    {itineraryGalleryPhotoWhileEditing != "" &&
                    
                      <div className={styles.profilePicPreviewImageContainer}> 
                        <Image 
                            src={itineraryGalleryPhotoWhileEditing || ''} 
                            alt="No Image Selected" 
                            width={2048} // replace with actual image width
                            height={2048} // replace with actual image height
                            className={styles.profilePicturePreview}
                        />
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
                        {/* {resetPhotoIcon}                       */}
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

                  <ItineraryEditForm />
              
                  <div className={styles.plusSignContainerEF}>
                    <div className={styles.plusSignEF} onClick={handleSaveItemAndShowItemForm}>
                      <span className={styles.plusSignText}> itinerary item</span> + 
                    </div>
                  </div>
                  <DragDropSection />
              </div>
              <GoogleMapIframe />
              {!displayDeleteConfirmation &&
              <div className={styles.saveOrCancelButtonSectionP}>
                  <div className = {styles.iconSectionContainerP}>                                      
                      <div className = {styles.formControlsIconContainerP}>                
                          {trashDelete}
                      </div>
                      <p className = {styles.formControlsIconTextP}>Delete Itinerary</p>
                  </div>
                  <div className = {styles.iconSectionContainerP}>                                      
                      <div className = {styles.formControlsIconContainerP}>                
                          {floppySave}
                      </div>
                      <p className = {styles.formControlsIconTextP}>Save/Exit</p>
                  </div>        
              </div>}

              {displayDeleteConfirmation &&
              <div className={styles.EFConfirmDeleteItinContainer}>
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
                  </div>
                </div>}
</div>
  );
};

export default EditFormContainer;
 



















