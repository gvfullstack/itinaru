import React, { useState, FC, useRef, useEffect, createContext, useContext } from 'react';
import { ItineraryItems, ItineraryItem, Itinerary } from '../editFormTypeDefs';
import { v4 as uuidv4 } from 'uuid';
import styles from '../EditFormCSS/itineraryEditForm.module.css'
import {DynamicFontAwesomeIcon} from '@/components';
import { faQuestionCircle, faCrosshairs, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
import ItinEditFormTimePicker from './itinEditFormTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import StarRating from './siteStarRating';
import { useGoogleMaps } from './googleMapsProvider';
import {myItinerariesResults} from '../../MyItinerariesGallery/myItinerariesAtoms';
import { db  } from '../../FirebaseAuthComponents/config/firebase.database';
import { openDB } from 'idb';
import firebase from 'firebase/compat/app';
import {saveStatusDisplayedEditFormContainer} from '../editFormAtoms';
import DurationPicker from './durationPicker';
import EndTimeDisplay from './endTimeDisplay';
import DeleteConfirmationDialog from '../ItinItemDragDropSection/DeleteConfirmationDialog';
import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
import Quill from 'quill';
const Parchment = Quill.import('parchment');

var Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

const SizeStyle = new Parchment.Attributor.Style('size', 'font-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['16px', '18px', '20px', '22px']
});
Quill.register(SizeStyle, true);

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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    //Quill Config
    
    const modules = {
    toolbar: [
      [{ 'size': ['16px', '18px', '20px', '22px'] }],
      ['bold', 'italic', 'underline'],
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };
   
   ////////////////
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
         
        const addressInput = document.getElementById('addressInput') as HTMLInputElement | null;
        if (addressInput) {
          const addressAutocomplete = new google.maps.places.Autocomplete(addressInput, {
            fields: ["formatted_address","name"]
          });
      
          addressAutocomplete.addListener('place_changed', () => {
            const place = addressAutocomplete.getPlace();
            if (place) {
              updateItemInRecoilState({ itemTitle: `${place.name}`, locationAddress: `${place.name} ${place.formatted_address}` || '' }, itemId);
            }
          });
        }
      }
      
      useEffect(()=>{console.log(initialItemState)})
  
    useEffect(() => {
        if (isGoogleMapsLoaded) {
            initAutocomplete();
        }
        }, [isGoogleMapsLoaded]);

// `````````````````````````````````````````````````````xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const handleItemChange =  (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        setItineraryInEdit((prevItinerary: Itinerary) => {
            const itemId = initialItemState.id; 
            
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

        const handleLocationChange = (field: 'latitude' | 'longitude') => async (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = parseFloat(e.target.value);
          
          setItineraryInEdit((prevItinerary: Itinerary) => {
            const itemId = initialItemState.id;
            const itemIndex = prevItinerary.items?.findIndex(item => item.id === itemId);
          
            if (itemIndex === -1 || typeof itemIndex === 'undefined') return prevItinerary;
          
            const items = [...(prevItinerary.items ?? [])];  // Shallow copy
            const updatedItem = { ...items[itemIndex] };  // Shallow copy of the item
            
            let updatedLocation: { latitude: number; longitude: number; } = {
              latitude: 0,  // Provide a default value
              longitude: 0  // Provide a default value
            };
            
            if (updatedItem.location) {
              updatedLocation = { ...updatedItem.location };
            }
          
            updatedLocation[field] = newValue;  // newValue is already a number
            updatedItem.location = updatedLocation;
            items[itemIndex] = updatedItem;
          
            return {
              ...prevItinerary,
              items,
            };
          });
        };
        
        
   
//get coordinates
const fetchCurrentLocation = async () => {
  if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      alert("Geolocation is either not supported by your browser or has been denied permission by your security settings.");
      // Set coordinates to 0, 0 if geolocation is not available
      setCoordinatesToDefault();
      return;
  }

  navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      updateItineraryWithCoordinates(latitude, longitude);
  }, 
  () => {
      alert("Unable to retrieve your location. Please ensure your device has location services enabled or enter manually.");
      // Optionally, set coordinates to 0, 0 if location retrieval fails
      setCoordinatesToDefault();
  });
};

const setCoordinatesToDefault = () => {
  const defaultLatitude = 0;
  const defaultLongitude = 0;
  updateItineraryWithCoordinates(defaultLatitude, defaultLongitude);
}

const updateItineraryWithCoordinates = (latitude: number, longitude: number) => {
  console.log(`${latitude}, ${longitude}`, "coordinates");
  setItineraryInEdit((prevItinerary) => {
      const updatedItems = prevItinerary.items?.map((item) => {
          if (item.id === initialItemState.id) {
              return {
                  ...item,
                  location: {
                      latitude, 
                      longitude, 
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
}

const sortItineraryItemsByStartTime = (items: ItineraryItem[]): ItineraryItem[] => {
  return items.sort((a, b) => {
    const timeA = a.startTime?.time ? a.startTime.time.valueOf() : Infinity;
    const timeB = b.startTime?.time ? b.startTime.time.valueOf() : Infinity;
    return timeA - timeB;
  });
};

   
    const cancelMark = 
        <DynamicFontAwesomeIcon 
            icon={faXmark} 
            className={styles.cancelMark}
            onClick={props.handleShowItemForm}
        />

    const trashDelete = (
        <DynamicFontAwesomeIcon 
            icon={faTrashCan} 
            className={styles.trashIcon} 
            type="button" 
            onClick={() => {openDeleteConfirmation();}}
        />
    );

   
    const handleTimeChangeWithRecoilUpdate = (timeField: 'startTime' | 'endTime') => {
      return (date: Dayjs | null) => {
        if (dayjs.isDayjs(date) && date.isValid()) {
          // Standardize the date to 1/1/2000
          const standardizedDate = date.year(2000).month(0).date(1);
          
          setItineraryInEdit((prevItinerary: Itinerary) => {
            const updatedItems = prevItinerary.items?.map((item) => {
              if (item.id === initialItemState.id) {
                return {
                  ...item,
                  [timeField]: {
                    ...item[timeField],
                    time: standardizedDate
                  }
                };
              }
              return item;
            });
    
            const sortedItems = sortItineraryItemsByStartTime(updatedItems ?? []);
            
            return {
              ...prevItinerary,
              items: sortedItems
            };
          });
        }
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
      
      
  const openDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
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

    <TextField
    id="addressInput"
    label="Site Name/Address"
    variant="outlined"
    placeholder="Address"
    value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.locationAddress || null}
    onChange={handleItemChange('locationAddress')}
    className={`${styles.inputFields} ${styles.addressInputField}`}
    helperText={addressIsHovered ? "Address you enter will be used if no selection is made from the dropdown." : ''}
    onMouseEnter={() => setAddressIsHovered(true)}
    onMouseLeave={() => setAddressIsHovered(false)}
    />

    <TextField
    id="itemTitleInput"
    label="Itinerary Item Title"
    variant="outlined"
    placeholder="Site Name"
    value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.itemTitle || null}
    onChange={handleItemChange('itemTitle')}
    className={styles.inputFields}
    InputLabelProps={{
        shrink: true, // This will force the label to shrink
      }}
    />   

{/* Coordinates */}
{showInfoBoxGeolocation && 
        <div className={`${styles.infoBox} ${styles.infoBoxVisible}`}>
            <button className={styles.hideButton} onClick={() => setShowInfoBoxGeolocation(false)}>Hide</button>
            <p className={styles.sharedSettingIfo}>
              <strong>Important Note: </strong> The address field takes precedence. If you would like to use coordinates for map directions, please leave the address field blank.
              <br />
              <br />
              Also, when using the &quot; Use current geolocation &quot; feature to obtain your location, please be aware that the accuracy can vary based on several factors, including your device, surrounding buildings, and signal strength. It&apos;s always a good practice to double-check and confirm your location. If you notice any discrepancies, kindly adjust manually or choose a different method to ensure precision in your itinerary.
            </p>
        </div>  
    }
    
<div className={styles.fieldRow + " " + styles.geolocationSection}>
    <DynamicFontAwesomeIcon icon={faCrosshairs} className={styles.crossHair} 
    onClick={()=>fetchCurrentLocation()} 
    />

    <h4 style={{fontSize:"16px"}}>Use current geolocation</h4>
    <DynamicFontAwesomeIcon 
        icon={faQuestionCircle} 
        className={styles.infoIcon}
        onClick={() => setShowInfoBoxGeolocation(true)}
    />
    
</div>
{itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location && 
  <div className={styles.geoDisplaySection} >
      <TextField
      id="latitudeInput"
      label="latitude"
      variant="outlined"
      placeholder="e.g. 40.7128"
      value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.latitude || null}
      onChange={handleLocationChange('latitude')}
      className={`${styles.inputFields} ${styles.addressInputField}`}
      />
      <TextField
      id="longitudeInput"
      label="longitude"
      variant="outlined"
      placeholder="e.g. 40.7128"
      value={itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.longitude || null}
      onChange={handleLocationChange('longitude')}
      className={`${styles.inputFields} ${styles.addressInputField}`}
      />
      <p>{itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.latitude || ""},
      {itineraryInEdit.items?.find(item => item.id === initialItemState.id)?.location?.longitude || ""}
      </p>

      <button onClick={resetLatLong}>remove</button>
  </div>
}

    <div className={styles.inputFieldsTimeSelectSection}>    
        <div className = {styles.startTimeTimeContainer}>    
        <ItinEditFormTimePicker
                label="Start Time"
                value={startTimeState}
                onChange={handleTimeChangeWithRecoilUpdate('startTime')}
            />
        </div>
        {initialItem?.id && <EndTimeDisplay itemId={initialItem.id} />}
    </div>
                
        {initialItem?.id && <DurationPicker itemId={initialItem.id}/>}
        {/* <ItinEditFormTimePicker
            label="End Time"
            value={endTimeState}
            onChange={handleTimeChangeWithRecoilUpdate('endTime')}
        /> */}
 
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
                modules={modules} 

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
   
   {/* <StarRating initialItem={initialItem} updateItemInRecoilState={updateItemInRecoilState}/> */}
   
   {!showDeleteConfirmation && (
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
        </div>)}
        {showDeleteConfirmation && (
                  <DeleteConfirmationDialog
                    onCancel={closeDeleteConfirmation}
                    onConfirm={() => {
                      if (props.handleRemoveClick) {
                        props.handleRemoveClick();
                      }
                      if (props.handleShowItemForm) {
                        props.handleShowItemForm();
                      }
                    }}
                  />
                )}

</div>

    );
}

export default ItineraryItemForm;
