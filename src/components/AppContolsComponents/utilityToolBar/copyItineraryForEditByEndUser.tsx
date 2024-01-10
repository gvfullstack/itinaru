import React,{useState} from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { openDB } from 'idb';
import {currentlyViewingItineraryState, showNotLoggedInModal} from '../../PublicItineraryViewComponents/publicItinViewAtoms';
import { Itinerary, ItineraryItem } from '../../PublicItineraryViewComponents/publicItinViewTypeDefs'; // Update this path
import {IndexDBItinerary} from '../../EditFormComponents/editFormTypeDefs'
import { authUserState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import {updateIndexedDB} from '../../PublicItineraryViewComponents/copyItineraryUtilityFunctions/updateIndexDB';
import checkAuthenticatedUser from '../../PublicItineraryViewComponents/copyItineraryUtilityFunctions/checkAuthenticatedUser';
import {copyItineraryToFirestoreAndRetrieveUpdatedItinerary} from '../../PublicItineraryViewComponents/copyItineraryUtilityFunctions/copyItineraryToFirestoreAndRetrieveUpdatedItinerary';
import styles from './utilityToolbar.module.css'
import {DynamicFontAwesomeIcon} from '@/components';
import { faCopy, faSpinner } from '@fortawesome/free-solid-svg-icons';

const CopyItineraryButton: React.FC = () => {
  const router = useRouter();
  const currentlyViewingItinerary = useRecoilValue<Itinerary | null>(currentlyViewingItineraryState);
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [showNotLoggedInModalState, setShowNotLoggedInModalState] = useRecoilState(showNotLoggedInModal);
  const [isCopying, setIsCopying] = useState(false);

//////////////////////////////////////////////////////////////////////////////////
const copyItinerary = async () => {
  if (!checkAuthenticatedUser(authUser)) {
    setShowNotLoggedInModalState(true);
    return; 
  }
  
  setIsCopying(true); // Start loading

  try {
    const copiedItinerary = await copyItineraryToFirestoreAndRetrieveUpdatedItinerary(
      currentlyViewingItinerary || undefined, authUser?.uid || undefined
    );
    if (copiedItinerary) {
      updateIndexedDB(copiedItinerary, authUser);
      router.push(`/user/editMyItinerary`);
    }
  } catch (error) {
    console.error('Error copying itinerary:', error);
    toast.error('Error while copying itinerary.'); // Optionally show error message to user
  } finally {
    setIsCopying(false); // Stop loading regardless of success or failure
  }
};


  const copyIcon = <DynamicFontAwesomeIcon icon={faCopy} />
  const spinner = <DynamicFontAwesomeIcon icon={faSpinner} spin />


  return (
    <button 
        className={styles.utilityToolbarButton} 
        onClick={copyItinerary}
        title="Copy Itinerary"
        aria-label="Copy Itinerary"
        disabled={isCopying} // Disable button when copying is in progress
        >
      {isCopying ? (<span>{spinner} creating...</span>) : copyIcon}
    </button>
  );
};

export default CopyItineraryButton;
