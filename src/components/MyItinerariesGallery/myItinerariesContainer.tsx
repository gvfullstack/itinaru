import ItinGalCompWrapper from './itinGallerySubComponents/itinGalCompWrapper';
import ItinGalleryComponent from './itinGallerySubComponents/itinGalleryComponent';
import styles from './myItineraries.module.css';
import { useState, useRef, useEffect } from 'react';
import { TransformedItinerary } from '../EditFormComponents/editFormTypeDefs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {myItinerariesResults} from './myItinerariesAtoms';
import {useRecoilState } from 'recoil';
import  fetchUserItineraries  from './myItineraryUtilityFunctions/fetchMyItineraries';
import { toast } from 'react-toastify';
import { authUserState } from '../../atoms/atoms'
import { openDB } from 'idb';
import SharedItineraries from './itinerariesSharedWithMe';
  
const MyItineraries: React.FC = () => {

  const [myItineraries, setMyItineraries] = useRecoilState(myItinerariesResults);
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [activeTab, setActiveTab] = useState<'private' | 'shared' | 'public' | 'sharedWithMe'>('private'); // Added this state
  const userId = authUser?.uid as string;

  useEffect(() => {
    const fetchData = async () => {
      const itineraries = await fetchUserItineraries(userId);
      if (itineraries !== undefined) {
        setMyItineraries(itineraries);
        await updateIndexedDB(itineraries, false);
      }
    };
  
    const updateIndexedDB = async (itineraries: TransformedItinerary[], needsRefresh: boolean) => {
      const db = await openDB('itinerariesDatabase');
      const tx = db.transaction('myItineraries', 'readwrite');
      const store = tx.objectStore('myItineraries');
      await store.put(itineraries, `userItineraries_${userId}`);
      await store.put(needsRefresh, `indexDBNeedsRefresh_${userId}`);
      
      // Read back the value to confirm it was saved
      const refreshedValue = await store.get(`indexDBNeedsRefresh_${userId}`);
      
      await tx.done;
    };  
  
    const loadFromIndexedDB = async () => {
      const db = await openDB('itinerariesDatabase');
      const tx = db.transaction('myItineraries', 'readonly');
      const store = tx.objectStore('myItineraries');
      const cachedItineraries = await store.get(`userItineraries_${userId}`);
      const needsRefresh = await store.get(`indexDBNeedsRefresh_${userId}`);
  
      if (cachedItineraries && !needsRefresh && authUser) {
        setMyItineraries(cachedItineraries);
      } else if (authUser) {
        fetchData();
      }
  
      await tx.done;
    };
  
    loadFromIndexedDB();
  
  }, [userId]);
  

  const checkedItineraries = myItineraries.map(itinerary => {
    const defaultSettings = {
      title: "",
      description: "",
      city: "",
      state: "",
      visibility: "private" as 'private' | 'shared' | 'public'
    };
  
    return {
      ...itinerary,
      settings: {
        ...defaultSettings,
        ...itinerary.settings
      }
    };
  });

  let filteredItineraries;
  if(activeTab  !== 'sharedWithMe'){
    filteredItineraries = checkedItineraries?.filter(itin => itin?.settings?.visibility === activeTab);
  }

  return (
    <div>
      <h1 className={styles.myItinerariesTitle}>My Itineraries</h1>
      <div className={styles.tabContainer}>
        <button className={`${styles.tabButton} ${activeTab === 'private' ? styles.active : ''}`} onClick={() => setActiveTab('private')}>Private</button>
        <button className={`${styles.tabButton} ${activeTab === 'shared' ? styles.active : ''}`} onClick={() => setActiveTab('shared')}>Shared</button>
        <button className={`${styles.tabButton} ${activeTab === 'public' ? styles.active : ''}`} onClick={() => setActiveTab('public')}>Public</button>
        <button className={`${styles.tabButton} ${activeTab === 'sharedWithMe' ? styles.active : ''}`} onClick={() => setActiveTab('sharedWithMe')}>Shared With Me</button>
      </div>
      
      {activeTab !== 'sharedWithMe' && <ItinGalCompWrapper>
        {filteredItineraries && filteredItineraries.map((itin, index) => (
          <ItinGalleryComponent 
            key={index}
            itinerary={itin}
          />
        ))}
      </ItinGalCompWrapper>}

    {activeTab === 'sharedWithMe' &&
      <SharedItineraries />}
    </div>
  );  
}
export default MyItineraries;


