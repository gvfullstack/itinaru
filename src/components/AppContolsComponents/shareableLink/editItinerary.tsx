import React from 'react';
import { useRouter } from 'next/router';
import { DynamicFontAwesomeIcon } from '@/components';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import style from '../utilityToolBar/utilityToolbar.module.css';
import { useRecoilState } from 'recoil';
import { currentlyEditingItineraryState } from '@/components/EditFormComponents/editFormAtoms';
import { currentlyViewingItineraryState } from '@/components/PublicItineraryViewComponents/publicItinViewAtoms';
import { authUserState } from '../../../atoms/atoms'
import { openDB } from 'idb';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {fetchItineraryAndItems} from '../../MyItinerariesGallery/myItineraryUtilityFunctions/fetchIndividualItinerary'

const EditButton: React.FC = () => {
    const router = useRouter();
    const editIcon = <DynamicFontAwesomeIcon icon={faPenToSquare} />
    const [currentlyViewingItinerary, setCurrentlyViewingItinerary] = useRecoilState(currentlyViewingItineraryState);
    const [currentUser, setCurrentUser] = useRecoilState(authUserState);



    const handleEditClick = async () => {
        console.log(currentlyViewingItinerary)
        if (currentlyViewingItinerary?.id) {
            const itineraryForEdit = await fetchItineraryAndItems(currentlyViewingItinerary.id)

            // Open the IndexedDB database and store the updated itinerary
            const indexDB = await openDB('itinerariesDatabase');
            const tx = indexDB.transaction('itineraries', 'readwrite');
            const store = tx.objectStore('itineraries');
            await store.put(itineraryForEdit, `currentlyEditingItineraryStateEF_${currentUser?.uid}`);
            await tx.done;
            router.push(`/user/editItineraryLoader`);
        }
    };

    return (
        currentlyViewingItinerary?.uid === currentUser?.uid ? (
            <button className={style.utilityToolbarButton} onClick={handleEditClick}>
                {editIcon}
            </button>
        ) : null
    );
};

export default EditButton;



//     // Convert startTime and endTime for each item to Unix timestamp
        //     const convertedItems = currentlyViewingItinerary.items?.map(item => {
        //         return {
        //             ...item,
        //             startTime: item.startTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.startTime.time.toDate()) } : null,
        //             endTime: item.endTime?.time ? { time: firebase.firestore.Timestamp.fromDate(item.endTime.time.toDate()) } : null,                    };
        //     });

        //     // Update the currentlyViewingItinerary with the converted items
        //     const updatedItinerary = {
        //         ...currentlyViewingItinerary,
        //         items: convertedItems,
        //     };