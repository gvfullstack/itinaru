import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './createItineraryLoader.module.css';
import {currentlyEditingItineraryState,  defaultItinerary} from '../../components/EditFormComponents/editFormAtoms';
import { useRecoilState } from 'recoil';
import { set } from 'lodash';

const CreateItineraryLoader: React.FC = () => {
  const router = useRouter();
  const [itinerary, setItinerary] = useRecoilState(currentlyEditingItineraryState);

  useEffect(() => {  
    // Delayed navigation
    setItinerary(defaultItinerary);
    const timer = setTimeout(() => {
      router.push('/user/editMyItinerary');
    }, 500); 
  
    // Clean up the timer when the component is unmounted or if the effect reruns
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className={styles.loaderContainer}>
      <p>Loading Itinerary...</p>
    </div>
  );
};

export default CreateItineraryLoader;
