import React, {useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
// import EditFormContainer from '../../components/EditFormComponents/editFormContainer';
import {currentlyEditingItineraryState, saveStatusDisplayedEditFormContainer} from '../../components/EditFormComponents/editFormAtoms';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { openDB } from 'idb';
import dayjs, {Dayjs} from 'dayjs'; 
import { IndexDBItinerary, IndexDBItineraryItem } from '../../components/EditFormComponents/editFormTypeDefs';


const SkeletonForm = () => {

  return (
    <div style={{ opacity: 0.5, marginTop: "4rem", padding: "2rem 15rem"}}>
      {/* Adjust the skeleton form as needed */}
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '80px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{gap:"1rem",  width: '100%', display: "flex", height: '40px', marginBottom: '10px', borderRadius: "10px" }}>
          <div style={{ width: "1rem", height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>

      </div>
      
    </div>
  );
}

const EditFormContainer = dynamic(() => import('../../components/EditFormComponents/editFormContainer'), {
  loading: () => <SkeletonForm />,
  ssr: false
  });

const EFEditPage: React.FC = () => {
  const router = useRouter();
  const [itinerary, setItinerary] = useRecoilState(currentlyEditingItineraryState);
  const toastShownRef = useRef(false);
  const [loadingData, setLoadingData] = useState(true); // State to track loading
  const [saveStatus, setSaveStatus] = useRecoilState(saveStatusDisplayedEditFormContainer); // additional state for saving status

  useEffect(() => {
    const loadDataFromIndexedDB = async () => {
      try {
        const indexLocalDB = await openDB('itinerariesDatabase');
        const tx = indexLocalDB.transaction('itineraries', 'readonly');
        const store = tx.objectStore('itineraries');
        const data: IndexDBItinerary | undefined = await store.get('currentlyEditingItineraryStateEF');
    
        if (data && data.items) {
          // Map over items to transform time data
          const transformedItems = data.items.map((item: IndexDBItineraryItem) => {
            let startTime: Dayjs | null = null;
            let endTime: Dayjs | null = null;
    
            // Transform startTime to Dayjs if it's UnixTimeObject
            if (item.startTime?.time) {
              const seconds = item.startTime.time.seconds;
              if (typeof seconds === 'number') {
                startTime = dayjs.unix(seconds);
              }
            }
            // Transform endTime to Dayjs if it's UnixTimeObject
            if (item.endTime?.time && 'seconds' in item.endTime.time) {
              const seconds = item.endTime.time.seconds;
              if (typeof seconds === 'number') {
                endTime = dayjs.unix(seconds);
              }
            }
    
            return {
              ...item,
              startTime: { time: startTime },
              endTime: { time: endTime },
            };
          });
    
          // Update itinerary state
          setItinerary({
            ...data,
            items: transformedItems,
          });
    
          // Update save status
          setSaveStatus("Restoring...");
        }
      } catch (error) {
        console.error("Error loading data from IndexedDB:", error);
      } finally {
        setLoadingData(false);  // Update loading status
      }
    };
    
    // Load data only if itinerary is not already set
    if (!itinerary.id) {
      loadDataFromIndexedDB();
    } else {
      setLoadingData(false);  // Update loading status if `itinerary` is already set
    }
  }, []);

  useEffect(() => {
    if (!loadingData) {
      if (!itinerary?.id && !toastShownRef.current) {
        router.push('/');
        toast.error("Please select an itinerary to edit.");
        toastShownRef.current = true;
      }
    }
  }, [loadingData, itinerary]);

  
  return (
    <>
      <EditFormContainer />
    </>)
};

export default EFEditPage;


