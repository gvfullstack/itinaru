import React, { useEffect, useState, FC } from 'react';
import {ItinerarySettings, ItineraryItem } from './editFormTypeDefs';
import styles from './EditFormCSS/itineraryEditForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  // or quill.bubble.css if you're using the bubble theme
import {currentlyEditingItineraryState} from './editFormAtoms';
import {useRecoilState, useRecoilCallback} from 'recoil';
import TextField from '@mui/material/TextField';
const ReactQuill = dynamic(import('react-quill'), {
    ssr: false, // This will make the component render only on the client-side
    loading: () => <p>Loading...</p>, // You can provide a loading component or text here
  });

type Props = {
    handleShowItemForm: () => void;
}

const ItineraryEditForm: FC<Props> = ({ handleShowItemForm }) => {

    const [itinerary, setItinerary] = useRecoilState(currentlyEditingItineraryState);
      
    // HOF for itinerary settings changes
    const handleSettingsChange = (field: keyof ItinerarySettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setItinerary(currentItinerary => ({  
            ...currentItinerary,
            settings: {
              ...currentItinerary.settings,
              [field]: value
            }}));

      }

    const handleQuillChange = (value: string) => {
    setItinerary(currentItinerary => ({
        ...currentItinerary,
        settings: {
          ...currentItinerary.settings,
          description: value
        }}))
      }
      
    const handleAddItem = (item: ItineraryItem) => {
        const updatedItems = [...itinerary.items, item];
    
        setItinerary(prevItinerary => ({
            ...prevItinerary,
            items: updatedItems
        }));


    };
    
    
    const [showInfoBox, setShowInfoBox] = useState<boolean>(false);

    return (
        <div className = {styles.itineraryEditFormContainer}>
                <div className={styles.mainSettingsContainer} >
                    <TextField
                    id="itineraryTitle"
                    label="Itinerary title"
                    variant="outlined"
                    placeholder="Itinerary title"
                    value={itinerary.settings.title || ''}
                    onChange={handleSettingsChange('title')}
                    className={styles.inputFields}
                    />
                    <TextField
                    id="City"
                    label="City"
                    variant="outlined"
                    placeholder="City"
                    value={itinerary.settings.city || ''}
                    onChange={handleSettingsChange('city')}
                    className={styles.inputFields}
                    />

                    <TextField
                    id="State"
                    label="State"
                    variant="outlined"
                    placeholder="State"
                    value={itinerary.settings.state || ''}
                    onChange={handleSettingsChange('state')}
                    className={styles.inputFields}
                    />
                    <div className={styles.quillContainer}>
                        <ReactQuill
                        value={itinerary.settings.description}
                        onChange={handleQuillChange}
                        placeholder="Enter itinerary description..."
                        className={styles.quill}
                        />
                    </div>

                    
                    
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <label title="Visible only to you">
                            <input 
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={itinerary.settings.visibility === 'private'}
                                onChange={handleSettingsChange('visibility')}
                            />
                            Private
                        </label>
                        <label title="Visible to selected users">
                            <input 
                                type="radio"
                                name="visibility"
                                value="shared"
                                checked={itinerary.settings.visibility === 'shared'}
                                onChange={handleSettingsChange('visibility')}
                            />
                            Shared
                        </label>
                        <label title="Visible to everyone">
                            <input 
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={itinerary.settings.visibility === 'public'}
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
                                <p className={styles.sharedSettingIfo}><strong>IMPORTANT:<strong/></strong> This setting applies to the entire itinerary.</p>
                                <p className={styles.sharedSettingIfo}><strong>Private:</strong> Visible only to you, even if you have previously shared with other users.</p>
                                <p className={styles.sharedSettingIfo}><strong>Shared:</strong> Visible to users you have added to the "shared-with" lists. This must be selected even if you have added users to the "shared-with" lists.</p>
                                <p className={styles.sharedSettingIfo}><strong>Public:</strong> Visible to everyone.</p>
                                    
                            </div>
                            }
                    </div>
                </div>
            
        </div>
    );
  };
  
  export default ItineraryEditForm;


  