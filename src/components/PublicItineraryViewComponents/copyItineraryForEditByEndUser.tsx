import React from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { openDB } from 'idb';
import {currentlyViewingItineraryState, showNotLoggedInModal} from '../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { Itinerary, ItineraryItem } from './publicItinViewTypeDefs'; // Update this path
import {IndexDBItinerary} from '../../components/EditFormComponents/editFormTypeDefs'
import { authUserState } from '../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import {updateIndexedDB} from './copyItineraryUtilityFunctions/updateIndexDB';
import checkAuthenticatedUser from './copyItineraryUtilityFunctions/checkAuthenticatedUser';
import {createGenericFirestoreItineraryDocAndRetrieveDocRef} from './copyItineraryUtilityFunctions/createGenericFirestoreItineraryDocAndRetrieveDocRef';
import { DocumentReference } from 'firebase/firestore';
import {copyItineraryToFirestoreAndRetrieveUpdatedItinerary} from './copyItineraryUtilityFunctions/copyItineraryToFirestoreAndRetrieveUpdatedItinerary';
import styles from './publicItineraryView.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const copyIcon = <FontAwesomeIcon icon={faCopy} />

const CopyItineraryButton: React.FC = () => {
  const router = useRouter();
  const currentlyViewingItinerary = useRecoilValue<Itinerary | null>(currentlyViewingItineraryState);
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [showNotLoggedInModalState, setShowNotLoggedInModalState] = useRecoilState(showNotLoggedInModal);
  
//////////////////////////////////////////////////////////////////////////////////
  const copyItinerary = async () => {
  //open login modal if user is not logged in
    if (!checkAuthenticatedUser(authUser)) {
      setShowNotLoggedInModalState(true);
      return; 
    }
    console.log("user is authenticated")
    // Create a new itinerary in Firestore then, retrieve the updated itinerary, and update IndexedDB if user is logged in
    const copiedItinerary = await copyItineraryToFirestoreAndRetrieveUpdatedItinerary(currentlyViewingItinerary,  authUser?.uid || undefined)
    if (copiedItinerary) {
      updateIndexedDB(copiedItinerary, authUser);
      router.push(`/user/editMyItinerary`);
    }
  }
  const copyIcon = <FontAwesomeIcon icon={faCopy} />


  return (
    <button className={styles.copyItineraryButton} onClick={copyItinerary}>
      {copyIcon}
      copy
    </button>
  );
};

export default CopyItineraryButton;
