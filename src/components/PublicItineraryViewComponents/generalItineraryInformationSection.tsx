import React, { FC } from 'react';
import styles from './publicItineraryView.module.css'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {useRecoilState} from 'recoil';
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';
import Image from 'next/image';


const GeneralItineraryInformation: FC = () => {

    const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
      
    return (
        <div className = {styles.generalItineraryInformationContainer}>
            <Image 
                src={itinerary.settings.galleryPhotoUrl ? itinerary.settings.galleryPhotoUrl : ''} 
                alt="Itinerary Gallery Photo" 
                width={500} // replace with actual image width
                height={300} // replace with actual image height
            />
            <p className={styles.publicItinViewTitle}>{itinerary.settings.title }</p>
            <p>{itinerary.settings.city || ''}, {itinerary.settings.state || ''}</p>
            <div className={styles.itinTitleDescription}>
                <ItemDescriptionStaticComponent description={itinerary.settings.description ?? ''} />
            </div>    
        </div>
    );
  };
  
  export default GeneralItineraryInformation;


  