import React from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css'

const MyItineraries = dynamic(() => import('../../components/MyItinerariesGallery/myItinerariesContainer'), { ssr: false });

const MyItinerariesPage: React.FC = () => {
  return (
    <>

    <div className={styles.myItineraryPage} >
           <MyItineraries />
    </div>
    </>
  );
};

export default MyItinerariesPage;



