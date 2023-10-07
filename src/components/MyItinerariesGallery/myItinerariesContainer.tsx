import ItinGalCompWrapper from './itinGallerySubComponents/itinGalCompWrapper';
import ItinGalleryComponent from './itinGallerySubComponents/itinGalleryComponent';
import styles from './myItineraries.module.css';
import { useState, useRef, useEffect } from 'react';
import { TransformedItinerary } from './myItinerariesTypeDefs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {myItinerariesResults} from './myItinerariesAtoms';
import {useRecoilState } from 'recoil';
import  fetchUserItineraries  from './myItineraryUtilityFunctions/fetchMyItineraries';
import { toast } from 'react-toastify';
import { authUserState } from '../../atoms/atoms'
import { openDB } from 'idb';

  
const MyItineraries: React.FC = () => {

  const [myItineraries, setMyItineraries] = useRecoilState(myItinerariesResults);
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const userId = authUser?.uid as string;

  useEffect(() => {
    console.log(myItineraries, "myItineraries on load")
    const fetchData = async () => {
      const itineraries = await fetchUserItineraries(userId);
      if (itineraries !== undefined) {
        console.log("saved to indexedDB...")
        setMyItineraries(itineraries);
        await updateIndexedDB(itineraries, false);
      }
    };
  
    const updateIndexedDB = async (itineraries:TransformedItinerary[], needsRefresh:boolean) => {
      console.log("ran updateIndexedDB")
      const db = await openDB('itinerariesDatabase');
      const tx = db.transaction('myItineraries', 'readwrite');
      const store = tx.objectStore('myItineraries');
      await store.put(itineraries, 'userItineraries');
      await store.put(needsRefresh, 'indexDBNeedsRefresh');
      console.log(store, "store after fetch")
      await tx.done;
    };
  
    const loadFromIndexedDB = async () => {
      const db = await openDB('itinerariesDatabase');
      const tx = db.transaction('myItineraries', 'readonly');
      const store = tx.objectStore('myItineraries');
      const cachedItineraries = await store.get('userItineraries');
      const needsRefresh = await store.get('indexDBNeedsRefresh');
  
      if (cachedItineraries && !needsRefresh && authUser) {
        setMyItineraries(cachedItineraries);
      } else {
        console.log("fetching data from server...")
        fetchData();
      }
  
      await tx.done;
    };
  
    if (myItineraries.length === 0) {
      console.log("loading from indexedDB...");
      loadFromIndexedDB();
    }
  }, []);


    return(
        <div>
        <ItinGalCompWrapper>
          {myItineraries && myItineraries.map((itin, index) => (
            <ItinGalleryComponent 
              key={index}
              itinerary={itin}
              />
          ))}                    
        </ItinGalCompWrapper>
      </div>
        
    );
}
export default MyItineraries;


