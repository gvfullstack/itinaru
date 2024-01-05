import React, { useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import {showNotLoggedInModal} from './publicItinViewAtoms';
import {Itinerary } from './publicItinViewTypeDefs';
import {useRecoilState} from 'recoil';
import styles from './publicItineraryView.module.css'
import GoogleMapIframe from './directionsMapPV';
import NotLoggedInModal from './copyItineraryUtilityFunctions/notLoggedInModal';
import {TimeObject} from './publicItinViewTypeDefs'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';

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
 
  function formatTimestamp(timestamp: TimeObject | Date | { seconds: number, nanoseconds: number } | null | undefined): string {
    if (!timestamp) return '';
  
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
      // Handling Firestore Timestamp-like object
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return date.toLocaleString();
    } else if ('time' in timestamp && timestamp.time) {
      // Handling TimeObject
      const innerTimestamp = timestamp.time;
      if ('toDate' in innerTimestamp && typeof innerTimestamp.toDate === 'function') {
        // Handling Firestore Timestamp
        return innerTimestamp.toDate().toLocaleString();
      } else if ('seconds' in innerTimestamp && typeof innerTimestamp.seconds === 'number') {
        // Handling Firestore Timestamp-like object within TimeObject
        const date = new Date(innerTimestamp.seconds * 1000 + innerTimestamp.nanoseconds / 1000000);
        return date.toLocaleString();
      }
    }
    return ''; // Fallback for null, undefined, or unrecognized format
  }     

return (
<div className={styles.publicItinViewContainer}>
        <div className={styles.publicItinViewContentContainer}>
            <GeneralItineraryInformation />
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
    