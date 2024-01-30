import React from 'react';
import styles from './itinGalleryComponent.module.css';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../../AppContolsComponents/quillTextParserComponent';
import Image from 'next/image';
import { Itinerary, TransformedItinerary, TransformedItineraryItem, ItineraryItem, ItinerarySettings } from '../../EditFormComponents/editFormTypeDefs';
import { authUserState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import { openDB } from 'idb';
import dayjs, {Dayjs} from 'dayjs';
import 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { fetchItineraryItems } from '../myItineraryUtilityFunctions/fetchItineraryItems';

type ItinGalleryComponentProps = {
  itinerary: TransformedItinerary;
};

const ItinGalleryComponent: React.FC<ItinGalleryComponentProps> = ({itinerary}) => {
  const router = useRouter();
  const [checkedItinerary, setCheckedItinerary] = useState<TransformedItinerary>(itinerary);
 
  useEffect(() => {
    const defaultSettings: ItinerarySettings = {
      title: "",
      description: "",
      city: "",
      state: "",
      visibility: "private",
    };

    setCheckedItinerary({
      ...itinerary,
      settings: {
        ...defaultSettings,
        ...itinerary.settings,
      },
    });
  }, [itinerary]);

  const { id, uid, settings } = checkedItinerary;
  const { title, description, city, state, duration, galleryPhotoUrl } = settings!; // settings should now exist


  const [authUser, setAuthUser] = useRecoilState(authUserState);

  const truncateText = (text: string, maxLength: number) => {
    if(!text) return "";
    if (text.length > maxLength) {
      // Cut the text and add ellipsis
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const truncatedDescription = truncateText(description, 135);

  const defaultItinImageUrl = "https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/profilePictures%2FaOmGE5uedJTuxBTZGexTdOkUHbu1%2FprofilePicture?alt=media&token=3a432d96-92d0-40b2-8812-45f01462f078"
  
////////////////////////////////
const checkedItineraryRef = useRef<TransformedItinerary | null>(null);

const handleOpenEditView = async () => {
    if (!authUser || !authUser.uid) {
      toast.error("No authenticated user found. Please log in and try again.");
      console.error("No authenticated user found.");
      return;
    }

    if (typeof authUser?.uid !== 'string') {
      throw new Error("UID is not a string or is missing");
  }
  
  const items = await fetchItineraryItems(itinerary.id as string) ?? [];
  checkedItineraryRef.current = {
    ...itinerary,
    items,
  };

  setCheckedItinerary(checkedItineraryRef.current);
  await updateIndexedDB();

};

const updateIndexedDB = async () => {
  if (checkedItineraryRef.current) {
    const indexDB = await openDB('itinerariesDatabase');
    const tx = indexDB.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');
    await store.put(checkedItineraryRef.current, `currentlyEditingItineraryStateEF_${authUser?.uid}`);
    await tx.done;
    router.push(`/user/editItineraryLoader`);
  }
};

//////////////////////////////
  return (
    <div className={styles.container} onClick={handleOpenEditView}>
      <div className={styles.imageWrapper}>
        <div className={styles.aspectRatioBox}> 
            <Image
              src={galleryPhotoUrl || defaultItinImageUrl} 
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
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.text}>{`${city}${city?",":""} ${state}`}</p>
        <div className={styles.text}>
           <QuillTextParserComponent description={truncatedDescription}/>
        </div>
        {/* <p className={styles.text}>{props.description}</p> */}
        {/* <p className={styles.text}><strong>Duration:</strong> {duration}</p> */}
      </div>
    </div>
  );
};

export default ItinGalleryComponent;

