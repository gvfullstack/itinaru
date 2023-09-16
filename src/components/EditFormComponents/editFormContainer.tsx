import ItineraryEditForm from "./itineraryEditForm";
import React, { useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import {currentlyEditingItineraryState} from './editFormAtoms';
import { Itinerary, ItinerarySettings} from './editFormTypeDefs'
import {useRecoilState, useRecoilCallback} from 'recoil';
import styles from './EditFormCSS/itineraryEditForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { authUserState } from '../../atoms/atoms'
import { collection, doc, updateDoc, addDoc, deleteDoc, setDoc  } from 'firebase/firestore';
import { db  } from '../FirebaseAuthComponents/config/firebase.database';
import dayjs from 'dayjs';


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
    import('./itinItemDragDropSection/DragDropSection'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

    type Props = {
      mode?: "create" | "edit";
  }
  
  type TransformedItineraryItem   = {
    siteName?: string;
    startTime?: {time?: string | null};
    endTime?: {time?: string | null};
    description?: string;
    location?: {latitude: number, longitude: number};
    locationAddress?: string;
    rating?: number;
    locationWebsite?: string;
    expectedPerPersonBudget?: string;
    descHidden?: boolean;
    id?: string;
    averageWeatherOnTravelDate?: string;
    activityDuration?: number;
    userDefinedRespectedTime?: boolean;
    activityType?: string;
    itineraryParentId?: string;
    beingEdited?: boolean
  } 

  type TransformedItinerary = {
    id?: string;
    settings: ItinerarySettings;
    items: TransformedItineraryItem[];
}

const EditFormContainer: FC<Props> = ({...props}) => {

const [showItemForm, setShowItemForm] = useState(false);
const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
const [authUser, setAuthUser] = useRecoilState(authUserState);
const [isSaving, setIsSaving] = useState(false);

const handleShowItemForm = () => {
    setShowItemForm(prev=>!showItemForm);
}

const cancelMark = 
        <FontAwesomeIcon 
            icon={faXmark} 
            className={styles.cancelMark}
        />

const floppyDiskAddSave = (
    <FontAwesomeIcon 
        icon={faFloppyDisk as any} 
        className={styles.floppyDisk} 
        type="button" 
        onClick={saveItinerary}
    />
);
        
const trashDelete = (
  <FontAwesomeIcon 
      icon={faTrashCan} 
      className={styles.trashIcon} 
      type="button" 
      onClick={()=>handleDeleteItinerary(itinerary.id?itinerary.id:"")}
  />
);

const  handleDeleteItinerary = (itineraryId: string)=> {
  if(!itineraryId){
    return console.error("No itinerary ID provided.");
  }
  else{
    deleteItinerary(itineraryId)
  }

  setItinerary(
    {
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

function deleteItinerary(itineraryId: string): void {
  if (!authUser || !authUser.uid) {
    console.error("No authenticated user found.");
    return;
  }

  const itineraryRef = doc(db, 'itineraries', itineraryId);
  if (!authUser || !authUser.uid) {
    console.error("No authenticated user found.");
    return;
  }

  deleteDoc(itineraryRef)
      .then(() => {
          console.log("Itinerary successfully deleted!");
      })
      .catch((error) => {
          console.error("Error removing itinerary: ", error);
      });
}


function saveItinerary(): void {
  if (!authUser || !authUser.uid) {
    console.error("No authenticated user found.");
    return;
  }

  
  if (!itinerary.id) {
    console.error("Itinerary ID is missing. Cannot save.");
    return;
  }
  // Clone and transform the itinerary from Recoil state
  let transformedItinerary: TransformedItinerary = {
    ...itinerary,
    items: [] // initialize with empty array, will populate below
};

transformedItinerary.items = itinerary.items.map(item => {
    let transformedItem: TransformedItineraryItem = {
        ...item,
        startTime: item.startTime?.time ? { time: item.startTime.time.format() } : { time: null },
        endTime: item.endTime?.time ? { time: item.endTime.time.format() } : { time: null }
    };
    return transformedItem;
});


  const itineraryRef = doc(db, 'itineraries', itinerary.id);

  setDoc(itineraryRef, transformedItinerary)
    .then(() => {
      console.log("Itinerary successfully saved!");
    })
    .catch((error) => {
      console.error("Error saving itinerary: ", error);
    });
}


return (
<div className={styles.EFPageContainer}>
  
    {showItemForm && 
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <GoogleMapsProvider>
                <ItineraryItemForm 
                  handleShowItemForm={handleShowItemForm} 
                  mode="create"
                    />
              </GoogleMapsProvider>
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
    {/* <div className={styles.saveOrCancelButtonSectionFormContainerT}>
      {cancelMark}
    </div> */}

              <div className={styles.EFFormContainer}>
                  <ItineraryEditForm 
                    handleShowItemForm={handleShowItemForm}
                    />

                  <div className={styles.plusSignContainerEF}>
                    <div className={styles.plusSignEF} onClick={handleShowItemForm}>
                      <span className={styles.plusSignText}> itinerary item</span> + 
                    </div>
                  </div>
                  <DragDropSection />
                  <button onClick={()=>console.log(itinerary)}>print</button>
              </div>
    
</div>
  );
};

export default EditFormContainer;
    