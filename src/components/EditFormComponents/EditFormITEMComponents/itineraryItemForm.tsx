import React, { useState, FC, useRef, useEffect, createContext, useContext } from 'react';
import { ItineraryItems, ItineraryItem, Itinerary } from '../editFormTypeDefs';
import { v4 as uuidv4 } from 'uuid';
import styles from '../EditFormCSS/itineraryEditForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCrosshairs, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
// import ItinEditFormTimePicker from './itinEditFormTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import StarRating from './siteStarRating';
// import { useGoogleMaps } from './googleMapsProvider';
import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
const ReactQuill = dynamic(import('react-quill'), {
    ssr: false, // This will make the component render only on the client-side
    loading: () => <p>Loading...</p>, // You can provide a loading component or text here
  });
import {useRecoilState, useRecoilCallback} from 'recoil';
import {currentlyEditingItineraryState} from '../editFormAtoms';

type Props = {
    handleShowItemForm: () => void;
    mode?: "create" | "edit";
    initialItem?: ItineraryItem;
    handleRemoveClick?: () => void;
}


const ItineraryItemForm: FC<Props> = ({ ...props }) => {
    const [currentItem, setCurrentItem] = useState<ItineraryItem>(() => 
        props.mode === 'edit' && props.initialItem ? props.initialItem : { id: uuidv4(), descHidden: true }
        );   
    const [showInfoBoxGeolocation, setShowInfoBoxGeolocation] = useState<boolean>(false);
    const [siteIsHovered, setSiteIsHovered] = useState(false);
    const [addressIsHovered, setAddressIsHovered] = useState(false);
    const [itineraryInEdit, setItineraryInEdit] = useRecoilState<Itinerary>(currentlyEditingItineraryState);

    const handleAddItem = (item: ItineraryItem) => {
        setItineraryInEdit((prevItinerary: Itinerary) => ({
            ...prevItinerary,
            items: [
                ...prevItinerary.items,
                item
            ]
        }));
    }

    const handleEditItem = (item: ItineraryItem) => {
        setItineraryInEdit((prevItinerary: Itinerary) => ({
            ...prevItinerary,
            items: [
                ...prevItinerary.items.filter(prevItem => prevItem.id !== item.id),
                item
            ]
        }));
    }
    
    // const isGoogleMapsLoaded = useGoogleMaps();


    function initAutocomplete(): void {
        const siteInput = document.getElementById('siteNameInput') as HTMLInputElement | null;
        if (siteInput) {
            const siteAutocomplete = new google.maps.places.Autocomplete(siteInput, {
                fields: ["name", "formatted_address"]
            });
            siteAutocomplete.addListener('place_changed', () => {
                const place = siteAutocomplete.getPlace();
                if (place) {
                    setCurrentItem(prev => ({...prev, siteName: place.name, 
                        locationAddress: place.formatted_address || ''}));
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
                    setCurrentItem(prev => ({...prev, locationAddress: place.formatted_address || ''}));
                }
            });
        }
    }
  
//     useEffect(() => {
//   if (isGoogleMapsLoaded) {
//     initAutocomplete();
//   }
// }, [isGoogleMapsLoaded]);

    const handleItemChange = (field: keyof ItineraryItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault
        const value = e.target.value;
        setCurrentItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuillChange = (value: string) => {
        setCurrentItem(prev => ({
            ...prev,
            description: value
        }));
    };

  
//get coordinates
    const fetchCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const coordinates = latitude + ", " + longitude;
            setCurrentItem(prev => ({
                ...prev,
                location: { latitude: latitude, longitude:longitude, 
                    locationAddress: coordinates }
            }));
            }, () => {
            alert("Unable to retrieve your location.");
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
        const duration = calculateDuration(currentItem.startTime?.time || null, currentItem.endTime?.time || null);
        if (duration !== null) {
            setCurrentItem(prev => ({...prev, activityDuration: duration}));
        }
        console.log("duration", duration, currentItem.activityDuration)
    }, [currentItem.startTime, currentItem.endTime]);
    
    const cancelMark = 
        <FontAwesomeIcon 
            icon={faXmark} 
            className={styles.cancelMark}
            onClick={props.handleShowItemForm}
        />

    const floppyDiskAddSave = (
        <FontAwesomeIcon 
            icon={faFloppyDisk as any} 
            className={styles.floppyDisk} 
            type="button" 
            onClick={() => {
                if (props.mode === "create") {
                    handleAddItem(currentItem);
                    props.handleShowItemForm();
                } else {
                    handleEditItem(currentItem);
                    props.handleShowItemForm();
                    console.log("currentItem", currentItem);
                }
            }}
        />
    );
      
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
    return (

    <div className={styles.itinItemCreatorContainer}>
        <div className={styles.saveOrCancelButtonSection}>
            <div className = {styles.iconSectionContainer}>                
                <div className = {styles.formControlsIconContainer}>                
                    {trashDelete}
                </div>
                <p className = {styles.formControlsIconText}>Delete</p>
            </div>
            <div className = {styles.iconSectionContainer}>                
                <div className = {styles.formControlsIconContainer}>                
                    {floppyDiskAddSave}
                </div>
                <p className = {styles.formControlsIconText}>Save</p>
            </div>

            <div className = {styles.iconSectionContainer}>                
                <div className = {styles.formControlsIconContainer}>                
                    {cancelMark}
                </div>
                <p className = {styles.formControlsIconText}>Cancel</p>
            </div>            
        </div>
            
    {props.mode==="create" ?
        <h3 className = {styles.itemSectionHeading}>New Itinerary Item Entry</h3>:
        <h3 className = {styles.itemSectionHeading}>Edit Itinerary Item</h3>
    }
    <div className={styles.inputFieldsTimeSelectSection}>        
        <ItinEditFormTimePicker
                        label="Start Time"
                        value={currentItem.startTime?.time || null}
                        onChange={(date: Dayjs | null) => {
                            setCurrentItem((prev) => {
                                return {
                                    ...prev,
                                    startTime: {
                                        ...prev.startTime, 
                                        time: date || prev.startTime?.time
                                    }
                                };
                            });
                        }}
                    />

                <ItinEditFormTimePicker
                    label="End Time"
                    value={currentItem.endTime?.time || null}
                    onChange={(date: Dayjs | null) => {
                        setCurrentItem((prev) => {
                            return {
                                ...prev,
                                endTime: {
                                    ...prev.endTime, 
                                    time: date || prev.endTime?.time
                                }
                            };
                        });
                    }}
                />
    </div>

    <TextField
    id="siteNameInput"
    label="Site Name"
    variant="outlined"
    placeholder="Site Name"
    value={currentItem.siteName || ''}
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
        value={currentItem.locationAddress || ''}
        onChange={handleItemChange('locationAddress')}
        className={`${styles.inputFields} ${styles.addressInputField}`}
        helperText={addressIsHovered ? "Address you enter will be used if no selection is made from the dropdown." : ''}
        onMouseEnter={() => setAddressIsHovered(true)}
        onMouseLeave={() => setAddressIsHovered(false)}
    />

{/* Coordinates */}
<div className={styles.fieldRow + " " + styles.geolocationSection}>
    <FontAwesomeIcon icon={faCrosshairs} className={styles.crossHair} 
    onClick={()=>fetchCurrentLocation()} />

    <h4 style={{fontSize:"15px"}}>Use current geolocation</h4>
    <FontAwesomeIcon 
        icon={faQuestionCircle} 
        className={styles.infoIcon}
        onClick={() => setShowInfoBoxGeolocation(true)}
    />
    {showInfoBoxGeolocation && 
        <div className={`${styles.infoBox} ${styles.infoBoxVisible}`}>
            <button className={styles.hideButton} onClick={() => setShowInfoBoxGeolocation(false)}>Hide</button>
            <p className={styles.sharedSettingIfo}>When using the "Use current geolocation" feature to obtain your location, please be aware that the accuracy can vary based on several factors, including your device, surrounding buildings, and signal strength. It's always a good practice to double-check and confirm your location. If you notice any discrepancies, kindly adjust manually or choose a different method to ensure precision in your itinerary.</p>
        </div>  
    }
</div>

    <label htmlFor="siteDescription">Site Description:</label>
    <div className={styles.quillContainer}>
            <ReactQuill
            id="siteDescription" // adding id to associate with the label
            value={currentItem.description}
            onChange={handleQuillChange}
            placeholder="Enter site description..."
            className={styles.quill}
            />
    </div>
    
    <TextField
    id="budgetInput"
    label="Per person budget"
    variant="outlined"
    placeholder="Anticipated per person budget"
    value={currentItem.expectedPerPersonBudget || ''}
    onChange={handleItemChange('expectedPerPersonBudget')}
    className={`${styles.inputFields} ${styles.budgetInputField}`}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">$</InputAdornment>),
    }}/>
   
   <StarRating currentItem={currentItem} setCurrentItem={setCurrentItem} />
   

</div>

    );
}

export default ItineraryItemForm;

