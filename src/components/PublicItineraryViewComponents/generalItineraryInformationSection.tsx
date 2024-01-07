import React, { FC, useState } from 'react';
import styles from './publicItineraryView.module.css'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {useRecoilState} from 'recoil';
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ButtonToolbarContainer from '../AppContolsComponents/utilityToolBar/utilityToolBarContainer';
const GeneralItineraryInformation: FC = () => {
    const router = useRouter();
    
    const navigateToParentItinerary = () => {
        console.log('navigateToParentItinerary');
        if (itinerary?.derivedFromItineraryId) {
          router.push(`/viewItinerary/${itinerary.derivedFromItineraryId}`);
        }
      };
    
    const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
    const [summarySectionHidden, setSummarySectionHidden] = useState(false);
    
    const toggleSummarySection = () => {
        setSummarySectionHidden(!summarySectionHidden);
      }
  
    return (
        <div className = {styles.generalItineraryInformationContainer}>
          <ButtonToolbarContainer 
            toggleSummarySection={toggleSummarySection} 
            summarySectionHidden = {summarySectionHidden}
            />

           {!summarySectionHidden && <div className={styles.itinGeneralInfoPhotoContainer}>
                {itinerary?.settings?.galleryPhotoUrl && 
                    <Image 
                        src={itinerary.settings?.galleryPhotoUrl ? itinerary.settings.galleryPhotoUrl : ''} 
                        alt="Itinerary Gallery Photo" 
                        width={2400} // replace with actual image width
                        height={2400} // replace with actual image height
                        loading='lazy'
                        className={styles.itinGeneralInfoPhoto}
                        style={{objectFit: 'cover'}}            
                    />
                    }
            </div>}

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
            
           <div className={styles.itinGeneralInfoTextSectionWIthCopyButton}> 
                <div className={styles.itinGeneralInfoTextSection}>
                    <p className={styles.publicItinViewTitle}>{itinerary?.settings?.title }</p>
                    <p>{itinerary?.settings?.city || 'CITY MISSING'}, {itinerary?.settings?.state || 'STATE MISSING'}</p>
                </div>
            </div>
                
            {!summarySectionHidden && <div className={styles.itinTitleDescription}>
                <ItemDescriptionStaticComponent description={itinerary?.settings?.description ?? ''} />
            </div>  
                } 
          
        </div>
    );
  };
  
  export default GeneralItineraryInformation;


  