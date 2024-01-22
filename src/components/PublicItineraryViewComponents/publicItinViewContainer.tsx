import React, { useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import {showNotLoggedInModal} from './publicItinViewAtoms';
import {Itinerary } from './publicItinViewTypeDefs';
import {useRecoilState} from 'recoil';
import styles from './publicItineraryView.module.css'
import GoogleMapIframe from './directionsMapPV';
import NotLoggedInModal from './copyItineraryUtilityFunctions/notLoggedInModal';
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ButtonToolbarContainer from '../AppContolsComponents/utilityToolBar/utilityToolBarContainer';

const GeneralItineraryInformation = dynamic(() => 
    import('./generalItineraryInformationSection'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

const DragDropSection = dynamic(() =>
    import('./itinItemDragDropSection/DragDropSection'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

    type Props = {
      mode?: "create" | "edit";
  }

const PublicItinViewContainer: FC = () => {
  const [showNotLoggedInModalState, setShowNotLoggedInModalState] = useRecoilState(showNotLoggedInModal);
  const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
 
  function formatTimestamp(timestamp: firebase.firestore.Timestamp | Date | { seconds: number, nanoseconds: number } | firebase.firestore.FieldValue | string | null | undefined): string {
    if (!timestamp) return '';
  
    if (typeof timestamp === 'string') {
      // Assuming the string is an ISO date string
      const date = new Date(timestamp);
      return date.toLocaleString();
    } else if (timestamp instanceof Date) {
      // JavaScript Date object
      return timestamp.toLocaleString();
    } else if (timestamp instanceof firebase.firestore.Timestamp) {
      // Firestore Timestamp object
      return timestamp.toDate().toLocaleString();
    } else if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
      // Object with seconds and nanoseconds (similar to Firestore Timestamp)
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return date.toLocaleString();
    } else if (timestamp instanceof firebase.firestore.FieldValue) {
      // Firestore FieldValue (e.g., serverTimestamp) - not a readable timestamp in client-side code
      return 'Pending...'; // or some placeholder text, as actual timestamp is not available yet
    }
  
    return ''; // Fallback for null, undefined, or unrecognized format
}

       
const [summarySectionHidden, setSummarySectionHidden] = useState(false);
    
const toggleSummarySection = () => {
    setSummarySectionHidden(!summarySectionHidden);
  }

return (
  <div className={styles.sharedContainer}>  
        <ButtonToolbarContainer 
        toggleSummarySection={toggleSummarySection} 
        summarySectionHidden = {summarySectionHidden}
        />
        <div className={styles.publicItinViewContainer}>
                    <GeneralItineraryInformation summarySectionHidden={summarySectionHidden}/>
                    <DragDropSection />
                    <GoogleMapIframe /> 
                    <div className={styles.timeStamps}>Created: {itinerary && formatTimestamp(itinerary.creationTimestamp)}</div>
                    <div className={styles.timeStamps}>Last Updated: {itinerary && formatTimestamp(itinerary.lastUpdatedTimestamp)}</div>
                    {showNotLoggedInModalState && 
                      <NotLoggedInModal /> } 
        </div>
    </div>
  );
};

export default PublicItinViewContainer;
    