import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './createItineraryLoader.module.css';

const CreateItineraryLoader: React.FC = () => {
  const router = useRouter();

  useEffect(() => {  
    // Delayed navigation
    const timer = setTimeout(() => {
      router.push('/user/editMyItinerary');
    }, 888); // 2000 milliseconds = 2 seconds
  
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
