import React, { useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import {showNotLoggedInModal} from './publicItinViewAtoms';
import {Itinerary } from './publicItinViewTypeDefs';
import {useRecoilState} from 'recoil';
import styles from './publicItineraryView.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import GoogleMapIframe from './directionsMapPV';
import NotLoggedInModal from './copyItineraryUtilityFunctions/notLoggedInModal';

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

return (
<div className={styles.publicItinViewContainer}>
        <div className={styles.publicItinViewContentContainer}>
            <GeneralItineraryInformation />
            <DragDropSection />
            <GoogleMapIframe /> 
            {showNotLoggedInModalState && 
              <NotLoggedInModal /> } 
        </div>
</div>
  );
};

export default PublicItinViewContainer;
    