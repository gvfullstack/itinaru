import React, { FC } from 'react';
import styles from './publicItineraryView.module.css'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {useRecoilState} from 'recoil';
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';


const GeneralItineraryInformation: FC = () => {

    const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
      
    return (
        <div className = {styles.generalItineraryInformationContainer}>
           <img src={itinerary.settings.galleryPhotoUrl} alt="Itinerary Gallery Photo" />

            <p className={styles.publicItinViewTitle}>{itinerary.settings.title }</p>
            <p>{itinerary.settings.city || ''}, {itinerary.settings.state || ''}</p>
            <div className={styles.itinTitleDescription}>
                <ItemDescriptionStaticComponent description={itinerary.settings.description ?? ''} />
            </div>    
        </div>
    );
  };
  
  export default GeneralItineraryInformation;


  