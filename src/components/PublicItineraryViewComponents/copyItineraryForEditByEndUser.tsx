import React from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { openDB } from 'idb';
import {currentlyViewingItineraryState} from '../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { Itinerary } from './publicItinViewTypeDefs'; // Update this path

const CopyItineraryButton: React.FC = () => {
  const router = useRouter();
  const currentlyViewingItinerary = useRecoilValue<Itinerary | null>(currentlyViewingItineraryState);
  const authUser = { uid: 'user123' }; // Replace with actual auth user logic

  const updateIndexedDB = async () => {
    if (currentlyViewingItinerary) {
      console.log("Before openDB");
      const indexDB = await openDB('itinerariesDatabase');
      const tx = indexDB.transaction('itineraries', 'readwrite');
      const store = tx.objectStore('itineraries');
      await store.put(currentlyViewingItinerary, `currentlyEditingItineraryStateEF_${authUser?.uid}`);
      console.log("after openDB", store);
      await tx.done;
      router.push(`/user/editMyItinerary`);
    }
  };

  return (
    <button onClick={updateIndexedDB}>
      Copy Itinerary for Editing
    </button>
  );
};

export default CopyItineraryButton;
