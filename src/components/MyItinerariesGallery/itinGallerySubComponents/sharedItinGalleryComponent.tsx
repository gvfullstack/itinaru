import React, {useState, useRef} from 'react';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../../AppContolsComponents/quillTextParserComponent';
import Image from 'next/image';
import { Itinerary, UserAccessWithDocId } from '../../EditFormComponents/editFormTypeDefs';
import { authUserState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import {currentlyEditingItineraryState} from '../../EditFormComponents/editFormAtoms';
import { openDB } from 'idb';
import dayjs, {Dayjs} from 'dayjs';
import 'firebase/firestore';
import styles from './itinGalleryComponent.module.css';
import { TransformedItinerary} from '../../EditFormComponents/editFormTypeDefs';
import { fetchItineraryItems } from '../myItineraryUtilityFunctions/fetchItineraryItems';
import {fetchItineraryAndItems} from '../myItineraryUtilityFunctions/fetchIndividualItinerary';
import {currentlyViewingItineraryState} from '../../PublicItineraryViewComponents/publicItinViewAtoms';

type ItinGalleryComponentProps = {
  itinerary: UserAccessWithDocId;
};

const SharedItinGalleryComponent: React.FC<ItinGalleryComponentProps> = ({
  itinerary: {
    uid,
    email,
    username,
    profilePictureUrl,
    itineraryId,
    title,
    neighborhood,
    city,
    state,
    galleryPhotoUrl,
    role,
    docId,
  },
}) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [currentlyViewingItinerary, setCurrentlyViewingItinerary] = useRecoilState(currentlyViewingItineraryState);

  const getRandomImage = () => {
    const images = ['dubaiShine.jpg', 'landscape.jpg', 'rainbow.jpg', 'sunflower.jpg', 'tropicalSunset.jpg'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `/images/homePageGalleryDefaultImages/${images[randomIndex]}`;
  };
  
////////////////////////////////
const handleOpenRoleBasedView = () => {
  console.log("handleOpenRoleBasedView", role)
  switch (role) {
      case 'editor':
          handleOpenEditView();
          break;
      case 'viewer':
          handleOpenPreview();
          break;
      default:
          console.log('Unknown role');
  }
};
////////////////////////////////
const checkedItineraryRef = useRef<TransformedItinerary | null>(null);

const getItinerary = async () => {
  return await fetchItineraryAndItems(itineraryId as string);
};

function checkAuthenticatedUser(): boolean {
  if (!authUser || !authUser.uid) {
    console.error("No authenticated user found.");
    toast.warn("No authenticated user found.");
    return false;
  }
  return true;
}

const handleOpenEditView = async () => {
  
  if (!checkAuthenticatedUser()) {
      return;
    }
  
  const itinerary = await getItinerary();

  if (itinerary) {
    checkedItineraryRef.current = itinerary;
  } else {
    // Handle the case where the itinerary is not fetched properly
    console.log('Failed to fetch itinerary');
  }


  await updateIndexedDB();
};

/////////////////////////////
const handleOpenPreview = async () => {

    if (!checkAuthenticatedUser()) {
        return;
      }

    const itinerary = await getItinerary();

    
      if (itinerary && itinerary.id) {
        checkedItineraryRef.current = itinerary;
        const itemsForPreview = itinerary?.items.map((item) => {
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

    const itineraryForPreview: Itinerary = {
          ...itinerary,
          id: itinerary.id!,// Using non-null assertion here since the above guarantees a non null value
          items: itemsForPreview,
        };

    setCurrentlyViewingItinerary(itineraryForPreview)
    await updateIndexedDBPreview(itineraryForPreview);

    } else {
      // Handle the case where the itinerary is not fetched properly
      console.log('Failed to fetch itinerary');
    }
    
};
const updateIndexedDBPreview = async (itineraryForPreview:Itinerary) => {
  if (itineraryForPreview) {
    console.log("Before openDB");
    const indexDB = await openDB('itinerariesDatabase');
    const tx = indexDB.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');
    await store.put(itineraryForPreview, `currentlyPreviewingItinerary_${authUser?.uid}`);
    console.log("after openDB", store);
    await tx.done;
    router.push(`/viewPublicItinerary/previewItinerary`);

  }
};

const updateIndexedDB = async () => {
  if (checkedItineraryRef.current) {
    console.log("Before openDB");
    const indexDB = await openDB('itinerariesDatabase');
    const tx = indexDB.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');
    await store.put(checkedItineraryRef.current, `currentlyEditingItineraryStateEF_${authUser?.uid}`);
    console.log("after openDB", store);
    await tx.done;
    router.push(`/user/editMyItinerary`);

  }
};

//////////////////////////////
  return (
    <div className={styles.container} onClick={handleOpenRoleBasedView}>
      <div className={styles.imageWrapper}>
        <div className={styles.aspectRatioBox}> 
            <Image
              src={galleryPhotoUrl || getRandomImage()} 
              alt="No image uploaded by creator."   
              width={2400}
              height={2400}
              loading='lazy'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}            
              />
          {!galleryPhotoUrl && <div className={styles.watermark}>Stock Photo</div>}
          </div>
      </div>
      <div>
        <h5 className={styles.title}> {title}</h5>
        <p className={styles.text}>{`${city}${city?",":""} ${state}`}</p>        
      </div>
    </div>
  );
};

export default SharedItinGalleryComponent;

