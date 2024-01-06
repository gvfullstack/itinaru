import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {currentlyEditingItineraryState, newItineraryState} from '../../components/EditFormComponents/editFormAtoms';
import styles from './createItineraryLoader.module.css';

const CreateItineraryLoader: React.FC = () => {
  const router = useRouter();
  const [newItinerary, setNewItinerary] = useRecoilState(newItineraryState);
  const [itinerary, setItinerary] = useRecoilState(currentlyEditingItineraryState);

  useEffect(() => {
    setItinerary(newItinerary);

    // Navigate to edit itinerary page after state update
    router.push('/user/editMyItinerary');
  }, []);

  return (
    <div className={styles.loaderContainer}>
      <p>Creating Itinerary...</p>
    </div>
  );
};

export default CreateItineraryLoader;
