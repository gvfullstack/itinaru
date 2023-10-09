import React, { useState, FC, useRef, useEffect, createContext, useContext } from 'react';
import { ItineraryItems, ItineraryItem, Itinerary } from '../editFormTypeDefs';
import { v4 as uuidv4 } from 'uuid';
import styles from '../EditFormCSS/itineraryEditForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCrosshairs, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
import ItinEditFormTimePicker from './itinEditFormTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import StarRating from './siteStarRating';
import { useGoogleMaps } from './googleMapsProvider';
import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
import {myItinerariesResults} from '../../MyItinerariesGallery/myItinerariesAtoms';
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { openDB } from 'idb';
import firebase from 'firebase/compat/app';
import {saveStatusDisplayedEditFormContainer} from '../editFormAtoms';

const ReactQuill = dynamic(import('react-quill'), {
    ssr: false, // This will make the component render only on the client-side
    loading: () => <p>Loading...</p>, // You can provide a loading component or text here
  });
import {useRecoilState, useRecoilCallback} from 'recoil';
import {currentlyEditingItineraryState} from '../editFormAtoms';
import { toast } from 'react-toastify';

type Props = {
    handleShowItemForm: () => void;
    mode?: "create" | "edit";
    initialItem?: ItineraryItem;
    handleRemoveClick?: () => void;
}


const ItineraryItemForm: FC<Props> = ({ initialItem, ...props }) => { 
    const [showInfoBoxGeolocation, setShowInfoBoxGeolocation] = useState<boolean>(false);
    const [siteIsHovered, setSiteIsHovered] = useState(false);
    const [addressIsHovered, setAddressIsHovered] = useState(false);
    const [itineraryInEdit, setItineraryInEdit] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
    const [myItineraries, setMyItineraries] = useRecoilState(myItinerariesResults);
    const initialItemState = initialItem || { id: uuidv4() };
    const startTimeState = itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.startTime?.time || null;
    const endTimeState = itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.endTime?.time || null;
    const [saveStatus, setSaveStatus] = useRecoilState(saveStatusDisplayedEditFormContainer); // additional state for saving status

   
    const isGoogleMapsLoaded = useGoogleMaps();

    const updateItemInRecoilState = (updatedFields: Partial<ItineraryItem>, itemId: string) => {
        setItineraryInEdit((prevItinerary: Itinerary) => {
          const updatedItems = prevItinerary.items?.map(item => {
            if (item.id === itemId) {
              return { ...item, ...updatedFields };
            }
            return item;
          });
          return { ...prevItinerary, items: updatedItems };
        });
      };
      
      function initAutocomplete(): void {
        if(!initialItemState || !initialItemState.id){toast.error("No data found, please close form and try again."); return }
        const itemId = initialItemState.id; // or however you have access to the item's ID
      
        const siteInput = document.getElementById('siteNameInput') as HTMLInputElement | null;
        if (siteInput) {
          const siteAutocomplete = new google.maps.places.Autocomplete(siteInput, {
            fields: ["name", "formatted_address"]
          });
          siteAutocomplete.addListener('place_changed', () => {
            const place = siteAutocomplete.getPlace();
            if (place) {
              updateItemInRecoilState({ siteName: place.name, locationAddress: place.formatted_address || '' }, itemId);
            }
          });
        }
      
        const addressInput = document.getElementById('addressInput') as HTMLInputElement | null;
        if (addressInput) {
          const addressAutocomplete = new google.maps.places.Autocomplete(addressInput, {
            fields: ["formatted_address"]
          });
      
          addressAutocomplete.addListener('place_changed', () => {
            const place = addressAutocomplete.getPlace();
            if (place) {
              updateItemInRecoilState({ locationAddress: place.formatted_address || '' }, itemId);
            }
          });
        }
      }
      
  
    useEffect(() => {
        if (isGoogleMapsLoaded) {
            initAutocomplete();
        }
        }, [isGoogleMapsLoaded]);


    const handleItemChange =  (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        setItineraryInEdit((prevItinerary: Itinerary) => {
            // Assuming you know the item ID you want to update
            const itemId = initialItemState.id; // Replace with actual ID
            
            // Find the index of the item
            const itemIndex = prevItinerary.items?.findIndex(item => item.id === itemId);

            if (itemIndex === -1 || typeof itemIndex == 'undefined') return prevItinerary; // If item not found, no changes
            const items = prevItinerary.items ?? [];

            // Clone the item and update the field
            const updatedItem = {
            ...items[itemIndex],
            [field]: newValue
            };
        
            // Produce new items array
            const updatedItems = [...items];
            updatedItems[itemIndex] = updatedItem;

            return {
            ...prevItinerary,
            items: updatedItems
            };
        });


        };
   
//get coordinates
    const fetchCurrentLocation = async () => {
        console.log("ran fetchCurrentLocation")
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const coordinates = latitude + ", " + longitude;

            setItineraryInEdit((prevItinerary: Itinerary) => {
                const updatedItems = prevItinerary.items?.map((item) => {
                  if (item.id === initialItemState.id) {  // Replace `currentItem.id` with appropriate logic if needed
                    return {
                      ...item,
                      location: {
                        latitude: latitude, 
                        longitude:longitude, 
                        locationAddress: coordinates 
                      }
                    };
                  }
                  return item;
                });
                
                return {
                  ...prevItinerary,
                  items: updatedItems
                };
              });     
            }, 
            () => {alert("Unable to retrieve your location.");
        });
    };

 ///DURATION
 const calculateDuration = (start: Dayjs | null | undefined, end: Dayjs | null | undefined): number | null => {
    if (start && end) {
        const duration = end.diff(start); // No unit specified, so it defaults to milliseconds.
        return duration >= 0 ? duration : null;
    }
    return null;
}


    useEffect(() => {
        const duration = calculateDuration(startTimeState || null, endTimeState || null);

        if (duration !== null) {
            updateItemInRecoilState({ activityDuration: duration }, initialItemState.id ||"")
        }
    }, [startTimeState, endTimeState]);
    
    const cancelMark = 
        <FontAwesomeIcon 
            icon={faXmark} 
            className={styles.cancelMark}
            onClick={props.handleShowItemForm}
        />

    const trashDelete = (
        <FontAwesomeIcon 
            icon={faTrashCan} 
            className={styles.trashIcon} 
            type="button" 
            onClick={() => { 
                if (props.handleRemoveClick) {
                  props.handleRemoveClick();
                }
                if (props.handleShowItemForm) {
                  props.handleShowItemForm();
                }
              }}
        />
    );

   
    const handleTimeChangeWithRecoilUpdate =  (timeField: 'startTime' | 'endTime') => {
        return (date: Dayjs | null) => {        
          // Update Recoil state
          setItineraryInEdit((prevItinerary: Itinerary) => {
            const updatedItems = prevItinerary.items?.map((item) => {
              if (item.id === initialItemState.id) {  // Replace `currentItem.id` with appropriate logic if needed
                return {
                  ...item,
                  [timeField]: {
                    ...item[timeField],
                    time: date || item[timeField]?.time
                  }
                };
              }
              return item;
            });
            
            return {
              ...prevItinerary,
              items: updatedItems
            };
          });
        };
      };

      const resetLatLong = () => {
        setItineraryInEdit((prevItinerary: Itinerary) => {
          const updatedItems = prevItinerary.items?.map((item) => {
            if (item.id === initialItemState.id) {  
              // Destructure the item to isolate the 'location' and keep the rest of the properties
              const { location, ...restOfItem } = item;
              return restOfItem;
            }
            return item;
          });
      
          return {
            ...prevItinerary,
            items: updatedItems
          };
        });
      };
      
      
    return (

    <div className={styles.itinItemCreatorContainer}>
       
   <div className={styles.itinItemHeadingContainer}>          
    {props.mode==="create" ?
        <h4 className = {styles.itemSectionHeading}>New Itinerary Item Entry</h4>:
        <h2 className = {styles.itemSectionHeading}>Edit Itinerary Item</h2>
    }
    <p className={styles.saveStatusDisplayed}>{saveStatus}</p>
    </div>
    <div className={styles.inputFieldsTimeSelectSection}>        
        <ItinEditFormTimePicker
                label="Start Time"
                value={startTimeState}
                onChange={handleTimeChangeWithRecoilUpdate('startTime')}
            />

        <ItinEditFormTimePicker
            label="End Time"
            value={endTimeState}
            onChange={handleTimeChangeWithRecoilUpdate('endTime')}
        />
    </div>

    <TextField
    id="siteNameInput"
    label="Site Name"
    variant="outlined"
    placeholder="Site Name"
    value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.siteName || null}
    onChange={handleItemChange('siteName')}
    className={styles.inputFields}
    helperText={siteIsHovered ? "Site name you enter will be used if no selection is made from the dropdown." : ''}
    onMouseEnter={() => setSiteIsHovered(true)}
    onMouseLeave={() => setSiteIsHovered(false)}
    />

    <TextField
    id="addressInput"
    label="Address"
    variant="outlined"
    placeholder="Address"
    value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.locationAddress || null}
    onChange={handleItemChange('locationAddress')}
    className={`${styles.inputFields} ${styles.addressInputField}`}
    helperText={addressIsHovered ? "Address you enter will be used if no selection is made from the dropdown." : ''}
    onMouseEnter={() => setAddressIsHovered(true)}
    onMouseLeave={() => setAddressIsHovered(false)}
    />

{/* Coordinates */}
{showInfoBoxGeolocation && 
        <div className={`${styles.infoBox} ${styles.infoBoxVisible}`}>
            <button className={styles.hideButton} onClick={() => setShowInfoBoxGeolocation(false)}>Hide</button>
            <p className={styles.sharedSettingIfo}>When using the {"Use current geolocation"} feature to obtain your location, please be aware that the accuracy can vary based on several factors, including your device, surrounding buildings, and signal strength. It&apos;s always a good practice to double-check and confirm your location. If you notice any discrepancies, kindly adjust manually or choose a different method to ensure precision in your itinerary.</p>
        </div>  
    }
    
<div className={styles.fieldRow + " " + styles.geolocationSection}>
    <FontAwesomeIcon icon={faCrosshairs} className={styles.crossHair} 
    onClick={()=>fetchCurrentLocation()} 
    />

    <h4 style={{fontSize:"15px"}}>Use current geolocation</h4>
    <FontAwesomeIcon 
        icon={faQuestionCircle} 
        className={styles.infoIcon}
        onClick={() => setShowInfoBoxGeolocation(true)}
    />
    
</div>
{itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location && 
<div className={styles.geoDisplaySection} >
    <p>{itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.latitude || ""},
    {itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.longitude || ""}
    </p>

    <button onClick={resetLatLong}>remove</button>
</div>}

    <label htmlFor="siteDescription">Site Description:</label>
    <div className={styles.quillContainer}>
            <ReactQuill
                id="siteDescription" // adding id to associate with the label
                value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.description || ""}
                onChange={(newContent) => {
                  // Creating a synthetic event object to match your handleItemChange function
                  const syntheticEvent = {
                    target: {
                      value: newContent
                    }
                  } as React.ChangeEvent<HTMLInputElement>;

                  handleItemChange('description')(syntheticEvent);
                }}
                placeholder="Enter site description..."
                className={styles.quill}
            />
    </div>
    
    <TextField
    id="budgetInput"
    label="Per person budget"
    variant="outlined"
    placeholder="Anticipated per person budget"
    value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.expectedPerPersonBudget || ""}
    onChange={handleItemChange('expectedPerPersonBudget')}
    className={`${styles.inputFields} ${styles.budgetInputField}`}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">$</InputAdornment>),
    }}
    />
   
   <StarRating initialItem={initialItem} updateItemInRecoilState={updateItemInRecoilState}/>
   
   <div className={styles.saveOrCancelButtonSection}>
            <div className = {styles.iconSectionContainer}>                
                <div className = {styles.formControlsIconContainer}>                
                    {trashDelete}
                </div>
                <p className = {styles.formControlsIconText}>Delete</p>
            </div>

            <div className = {styles.iconSectionContainer}>                
                <div className = {styles.formControlsIconContainer}>                
                    {cancelMark}
                </div>
                <p className = {styles.formControlsIconText}>Close</p>
            </div>            
        </div>

</div>

    );
}

export default ItineraryItemForm;











// *******************save to firestore operations*******************     

// const itineraryRef = db.collection('itineraries').doc(initialItemState.id);
// const [focusedValue, setFocusedValue] = useState<string | null>(null);

// const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//   setFocusedValue(e.target.value);
// };

  
// // Function to update a specific field in Firestore
// const updateFieldInFirestore = async <K extends keyof ItineraryItem> (field: K, value: ItineraryItem[K]) => {
//   const itemId = initialItemState.id;
//   try {
//     // Fetch current data
//     const doc = await itineraryRef.get();
//     if (doc.exists) {
//       const itineraryData = doc.data() as Itinerary;
      
//       // Find index of the item to update
//       const itemIndex = itineraryData.items.findIndex(item => item.id === itemId);
      
//       // If item is found, update the field
//       if (itemIndex > -1) {
//         const updatedItems = [...itineraryData.items];
//         updatedItems[itemIndex][field] = value;
        
//         // Update Firestore
//         await itineraryRef.update({
//           'items': updatedItems
//         });
        
//         console.log(`Field ${field} updated successfully`);
//       } else {
//         console.log(`Item with ID ${itemId} not found`);
//       }
//     } else {
//       console.log('Document does not exist');
//     }
//   } catch (error) {
//     console.log(`Error updating field ${field}:`, error);
//   }
// };

