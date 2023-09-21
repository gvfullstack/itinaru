import React, { useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {Itinerary } from './publicItinViewTypeDefs';
import {useRecoilState} from 'recoil';
import styles from './publicItineraryView.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';


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

const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyViewingItineraryState);
const router = useRouter();


return (
<div className={styles.publicItinViewContainer}>
        <div className={styles.publicItinViewContentContainer}>
            <GeneralItineraryInformation />
            <DragDropSection />
        </div>
</div>
  );
};

export default PublicItinViewContainer;
    