import React, { FC } from 'react';
import styles from './publicItineraryView.module.css'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {useRecoilState} from 'recoil';
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';
import Image from 'next/image';
import CopyItineraryButton from './copyItineraryForEditByEndUser';


const GeneralItineraryInformation: FC = () => {

    const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
      
    return (
        <div className = {styles.generalItineraryInformationContainer}>
            <div className={styles.itinGeneralInfoPhotoContainer}>
            {itinerary?.settings?.galleryPhotoUrl && <Image 
                    src={itinerary.settings?.galleryPhotoUrl ? itinerary.settings.galleryPhotoUrl : ''} 
                    alt="Itinerary Gallery Photo" 
                    width={2400} // replace with actual image width
                    height={2400} // replace with actual image height
                    loading='lazy'
                    className={styles.itinGeneralInfoPhoto}
                    style={{objectFit: 'cover'}}            
                />}
            </div>
            <div className={styles.itinGeneralInfoTextSectionWIthCopyButton}> 
                <div className={styles.itinGeneralInfoTextSection}>
                    <p className={styles.publicItinViewTitle}>{itinerary?.settings?.title }</p>
                    <p>{itinerary?.settings?.city || ''}, {itinerary?.settings?.state || ''}</p>
                </div>
                <div>
                    <CopyItineraryButton />
                </div>
            </div>
            <div className={styles.itinTitleDescription}>
                <ItemDescriptionStaticComponent description={itinerary?.settings?.description ?? ''} />
            </div>    
        </div>
    );
  };
  
  export default GeneralItineraryInformation;


  