import React from 'react';
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

  const getRandomImage = () => {
    const images = ['dubaiShine.jpg', 'landscape.jpg', 'rainbow.jpg', 'sunflower.jpg', 'tropicalSunset.jpg'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `/images/homePageGalleryDefaultImages/${images[randomIndex]}`;
  };
  
////////////////////////////////

const handleCreateAndGo = async () => {
  
    if (!authUser || !authUser.uid) {
      toast.error("No authenticated user found. Please log in and try again.");
      console.error("No authenticated user found.");
      return;
    }

    if (typeof authUser?.uid !== 'string') {
      throw new Error("UID is not a string or is missing");
  }

   
    // const indexDB = await openDB('itinerariesDatabase');
    // const tx = indexDB.transaction('itineraries', 'readwrite');
    // const store = tx.objectStore('itineraries');
  //   await store.put(itinerary, 'currentlyEditingItineraryStateEF');
  //  console.log(store, 'store')
    // await tx.done;

    // setItineraryToEdit(newTransformedItinerary);
    
    router.push(`/user/editMyItinerary`);

};

//////////////////////////////
  return (
    <div className={styles.container} onClick={handleCreateAndGo}>
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

