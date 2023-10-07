import React, { useEffect, useState, FC, forwardRef} from 'react';
import {ItinerarySettings, Itinerary } from '../editFormTypeDefs';
import styles from '../EditFormCSS/itineraryEditForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
import {currentlyEditingItineraryState} from '../editFormAtoms';
import {useRecoilState, useRecoilCallback} from 'recoil';
import TextField from '@mui/material/TextField';
import city_names from '../../../data/city_names.js';
import state_names from '../../../data/state_names.js';
import {myItinerariesResults} from '../../MyItinerariesGallery/myItinerariesAtoms';
import { openDB } from 'idb';

const ReactQuill = dynamic(import('react-quill'), {
    ssr: false, // This will make the component render only on the client-side
    loading: () => <p>Loading...</p>, // You can provide a loading component or text here
  });

type Props = {

}

// interface ChildComponentRef {
//     handleFormSubmitCheck: () => boolean;
// }

const ItineraryEditForm: FC<Props> = () => {

    const [itinerary, setItinerary] = useRecoilState(currentlyEditingItineraryState);
   
    const [titleError, setTitleError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [stateError, setStateError] = useState(false);

    const [titleHelperText, setTitleHelperText] = useState('');
    const [cityHelperText, setCityHelperText] = useState('');
    const [stateHelperText, setStateHelperText] = useState('');

    const [myItineraries, setMyItineraries] = useRecoilState(myItinerariesResults);


    const validateTitle = (value:string) => {
        if (!value || value.trim().length < 5 || value.trim().length > 100) {
          setTitleError(true);
          setTitleHelperText('Title should be between 5 and 100 characters.');
          return (false)

        }
        setTitleError(false);
        setTitleHelperText('');
        return (true)
      };
    
      const validateCity = (value:string) => {
        console.log("ran validateCity");
        if (!city_names.includes(value.toUpperCase())) 
        {
            console.log(!city_names.includes(value.toUpperCase()));
          setCityError(true);
          setCityHelperText('Invalid city name.');
          return (false)
        }
        setCityError(false);
        setCityHelperText('');
        return (true)
      };
    
      const validateState = (value:string) => {
        if (!state_names.includes(value.toUpperCase())) {
          setStateError(true);  
          setStateHelperText('Please enter a valid 2 character State.');
          return (false)
        }
        setStateError(false);
        setStateHelperText('');
        return (true)
      };

      const validateDescription = (value:string) => {return true}; // no validation needed for description, FOR NOW
      const validateVisibility = (value:string) => {return true}; // no validation needed for visibility, FOR NOW

// *******************save to localDatabase operations*******************    
      const [focusedValue, setFocusedValue] = useState<string | null>(null);
      const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocusedValue(e.target.value);
      };

      const validationFunctions: Record<FieldNames, (value: string) => boolean> = {
        title: validateTitle,
        city: validateCity,
        state: validateState,
        description: validateDescription,
        visibility: validateVisibility
        // Add more validation functions   here if needed
      };

      type FieldNames = 'title' | 'city' | 'state' | 'description' | 'visibility'; // Add more field names as needed


// Function to validate field and then update it if valid for the onBlur event
    const handleFieldChangeAndSave = async (field: FieldNames, value: string) => {
        // Look up the validation function for this field
        const validateFunc = validationFunctions[field];

        let isValid = true;  // Default to true for fields without validation

        // If a validation function exists, execute it
        if (validateFunc) {
          isValid = validateFunc(value);
        }

};
      
    
    // HOF for itinerary settings changes for the onChange event
    const handleSettingsChange = (field: keyof ItinerarySettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
    
      setItinerary((currentItinerary) => {
        // This ensures that settings is at least an empty object, and copies existing values if available.
        const currentSettings = { ...currentItinerary?.settings };
        
        return {
          ...currentItinerary,
          settings: {
            ...currentSettings,
            [field]: value || 'default_value',  // Replace 'default_value' with whatever default you prefer
          },
        } as Itinerary;  // This asserts that the object returned conforms to the Itinerary type
      });
    };
    
    
/////////////////////////// save operations for quill///////////////////////////
const handleQuillChange = (field: FieldNames, value: string) => {
  setItinerary(currentItinerary => ({
    ...currentItinerary,
    settings: {
      ...currentItinerary.settings,
      description: value
    }
  }) as Itinerary);
}
      // useEffect(() => {
      //   // Assuming `itinerary.settings.description` is the field you are interested in
      //   handleFieldChangeAndSave('description', itinerary.settings.description);
      //   handleFieldChangeAndSave('visibility', itinerary.settings.visibility);

      // }, [itinerary.settings.description, itinerary.settings.visibility]);

    
    const [showInfoBox, setShowInfoBox] = useState<boolean>(false);

///////////use this function to check the state of the database/////////////////////    

    async function checkDatabaseState() {
      // Open the database
      const db = await openDB('itinerariesDatabase');
          // Start a transaction
      const tx = db.transaction('itineraries', 'readonly');
          // Open the object store
      const store = tx.objectStore('itineraries');
    const existingData = await store.get('currentlyEditingItineraryStateEF');

          // Retrieve all records in the object store
      const allRecords = await store.getAll();
          // Log the records to the console
      console.log('Content of myItineraries object store:', existingData);
          // Wait for the transaction to complete
      await tx.done;
    }
    

        return (
        <div className = {styles.itineraryEditFormContainer}>
          {/* <button onClick={()=>checkDatabaseState()}>db</button>
          <button onClick={()=>console.log(itinerary)}>db</button> */}
                <div className={styles.mainSettingsContainer} >
                    <TextField
                      id="itineraryTitle"
                      label="Itinerary title"
                      variant="outlined"
                      placeholder="Itinerary title"
                      value={itinerary.settings?.title || ''}
                      onChange={handleSettingsChange('title')}
                      onBlur={(e) => {handleFieldChangeAndSave('title', e.target.value)}}
                      className={styles.inputFields}
                      error={titleError}
                      helperText={titleHelperText}
                      onFocus={handleFieldFocus}
                    />

                    <TextField
                      id="City"
                      label="City"
                      variant="outlined"
                      placeholder="City"
                      value={itinerary.settings?.city || ''}
                      onChange={handleSettingsChange('city')}
                      onBlur={(e) => {handleFieldChangeAndSave('city', e.target.value)}}
                      className={styles.inputFields}
                      error={cityError}
                      helperText={cityHelperText}
                      onFocus={handleFieldFocus}
                    />

                    <TextField
                      id="State"
                      label="State"
                      variant="outlined"
                      placeholder="State"
                      value={itinerary.settings?.state || ''}
                      onChange={handleSettingsChange('state')}
                      onBlur={(e) => {handleFieldChangeAndSave('state', e.target.value)}}
                      className={styles.inputFields}
                      error={stateError}
                      helperText={stateHelperText}
                      onFocus={handleFieldFocus}
                    />

                    <div className={styles.quillContainer}>
                        <ReactQuill
                        value={itinerary.settings?.description}
                        onChange={(html) => handleQuillChange('description', html)}
                        placeholder="Enter itinerary description..."
                        className={styles.quill}
                      
                        />
                    </div>

                    <div className={styles.sharedSettingContainer}>
                    <label title="Visible only to you">
                    <input 
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={itinerary.settings?.visibility === 'private'}
                        onChange={handleSettingsChange('visibility')}
                    />
                    Private
                  </label>
                  <label title="Visible to selected users">
                    <input 
                        type="radio"
                        name="visibility"
                        value="shared"
                        checked={itinerary.settings?.visibility === 'shared'}
                        onChange={handleSettingsChange('visibility')}

                    />
                    Shared
                  </label>
                  <label title="Visible to everyone">
                    <input 
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={itinerary.settings?.visibility === 'public'}
                        onChange={handleSettingsChange('visibility')}

                    />
                    Public
                  </label>
                        <FontAwesomeIcon 
                            icon={faQuestionCircle} 
                            className={styles.infoIcon}
                            onClick={() => setShowInfoBox(true)}
                        />
          
                        {showInfoBox && 
                            <div className={styles.infoBox + " " + styles.infoBoxVisible}>
                                <button className={styles.hideButton} onClick={() => setShowInfoBox(false)}>Hide</button>
                                <p className={styles.sharedSettingIfo}><strong>IMPORTANT:</strong> This setting applies to the entire itinerary.</p>
                                <p className={styles.sharedSettingIfo}><strong>Private:</strong> Visible only to you, even if you have previously shared with other users.</p>
                                <p className={styles.sharedSettingIfo}><strong>Shared:</strong> Visible to users you have added to the {'"shared-with"'} lists. This must be selected even if you have added users to the {'"shared-with"'} lists.</p>
                                <p className={styles.sharedSettingIfo}><strong>Public:</strong> Visible to everyone.</p>
                                    
                            </div>
                            }
                    </div>
                </div>
            
        </div>
    );
  };
  
  ItineraryEditForm.displayName = "ItineraryEditForm";

  export default ItineraryEditForm;


  