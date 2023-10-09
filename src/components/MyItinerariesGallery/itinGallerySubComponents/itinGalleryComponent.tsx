import React from 'react';
import styles from './itinGalleryComponent.module.css';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../../AppContolsComponents/quillTextParserComponent';
import Image from 'next/image';
import { Itinerary, TransformedItinerary, TransformedItineraryItem, ItineraryItem } from './itinGalTypeDefs';
import { authUserState } from '../../../atoms/atoms'
import { useRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import {currentlyEditingItineraryState} from '../../EditFormComponents/editFormAtoms';
import { openDB } from 'idb';
import dayjs, {Dayjs} from 'dayjs';
import 'firebase/firestore';

type ItinGalleryComponentProps = {
  itinerary: TransformedItinerary;
};

const ItinGalleryComponent: React.FC<ItinGalleryComponentProps> = ({itinerary}) => {
  const router = useRouter();
  const { id, uid, settings } = itinerary;
  const { title, description, neighborhood, city, state, duration, galleryPhotoUrl } = settings;
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [itineraryToEdit, setItineraryToEdit] = useRecoilState<Itinerary>(currentlyEditingItineraryState);

  const truncateText = (text: string, maxLength: number) => {
    if(!text) return "";
    if (text.length > maxLength) {
      // Cut the text and add ellipsis
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const truncatedDescription = truncateText(description, 135);

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

    let oldTransformedItinerary: TransformedItinerary = JSON.parse(JSON.stringify(itinerary))  
    
    oldTransformedItinerary.id = itinerary.id || "",
    oldTransformedItinerary.uid= itinerary.uid || "",
    oldTransformedItinerary.settings.title = itinerary.settings.title || "",
    oldTransformedItinerary.settings.description = itinerary.settings.description || "",
    oldTransformedItinerary.settings.city = itinerary.settings.city || "",
    oldTransformedItinerary.settings.state = itinerary.settings.state || "",
    oldTransformedItinerary.settings.visibility = itinerary.settings.visibility || "private",
    oldTransformedItinerary.settings.galleryPhotoUrl = itinerary.settings.galleryPhotoUrl || ""
    oldTransformedItinerary.items =  itinerary.items || []

    let newTransformedItinerary: Itinerary = {
      ...oldTransformedItinerary,
      items: oldTransformedItinerary.items.map(item => {
        console.log('Initial startTime:', item.startTime?.time);  // Debugging line
        console.log('Initial endTime:', item.endTime?.time);  // Debugging line
    
        return {
          ...item,
          startTime: item.startTime?.time ? { time: dayjs.unix(item.startTime.time.seconds) } : undefined,
          endTime: item.endTime?.time ? { time: dayjs.unix(item.endTime.time.seconds) } : undefined,
        };
      }),
    };
    console.log('New itinerary:', newTransformedItinerary);  // Debugging line
    const indexDB = await openDB('itinerariesDatabase');
    const tx = indexDB.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');
    await store.put(newTransformedItinerary, 'currentlyEditingItineraryStateEF');
   console.log(store, 'store')
    await tx.done;

    setItineraryToEdit(newTransformedItinerary);
    
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

