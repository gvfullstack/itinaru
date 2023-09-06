import React, { useState, FC, useRef, useEffect } from 'react';
import { ItineraryItem } from '../typeDefs';
import { v4 as uuidv4 } from 'uuid';
import styles from './itineraryEditForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import useGoogleMapsLoader from './useGoogleMapsLoader';
import ItinEditFormTimePicker from './itinEditFormTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import StarRating from './siteStarRating';

import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
const ReactQuill = dynamic(import('react-quill'), {
    ssr: false, // This will make the component render only on the client-side
    loading: () => <p>Loading...</p>, // You can provide a loading component or text here
  });

type Props = {
    onAddItem: (item: ItineraryItem) => void;
}

const ItineraryItemForm: FC<Props> = ({ onAddItem }) => {
    const isGoogleMapsLoaded = useGoogleMapsLoader(process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY as string);
    const [currentItem, setCurrentItem] = useState<ItineraryItem>({id: uuidv4()});
    const [showInfoBoxGeolocation, setShowInfoBoxGeolocation] = useState<boolean>(false);
    const [siteIsHovered, setSiteIsHovered] = useState(false);
    const [addressIsHovered, setAddressIsHovered] = useState(false);


    useEffect(() => {
        if (isGoogleMapsLoaded) {
            // Set up autocomplete for both Site and Address
            const siteInput = document.getElementById('siteNameInput') as HTMLInputElement;
            const siteAutocomplete = new google.maps.places.Autocomplete(siteInput, {
                fields: ["name", "formatted_address"]
            });
            
            siteAutocomplete.addListener('place_changed', () => {
                const place = siteAutocomplete.getPlace();
                if (place) {
                    setCurrentItem(prev => ({...prev, siteName: place.name}));
                    setCurrentItem(prev => ({...prev, locationAddress: place.formatted_address || ''}));
                }
            });
//////////////////////////////////////////
            const addressInput = document.getElementById('addressInput') as HTMLInputElement;
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
    }, [isGoogleMapsLoaded]);

    const handleItemChange = (field: keyof ItineraryItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = () => {
        onAddItem(currentItem);
        setCurrentItem({ locationAddress: '' });
    };
//get coordinates
    const fetchCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setCurrentItem(prev => ({
                ...prev,
                location: { latitude: latitude, longitude:longitude }
            }));
            const coordinates = latitude + ", " + longitude;
            setCurrentItem(prev => ({...prev, locationAddress: coordinates}));
        }, () => {
            alert("Unable to retrieve your location.");
        });
    };


    return (

    <div className={styles.itinItemCreatorContainer}>
    <h3>New Itinerary Item Entry</h3>
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
                                startTime: {
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
    className={styles.inputFields}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">$</InputAdornment>),
    }}/>
   
   <StarRating currentItem={currentItem} setCurrentItem={setCurrentItem} />

    <button type="button" onClick={handleSubmit}>Add site to itinerary</button>
    
</div>

    );
}

export default ItineraryItemForm;

