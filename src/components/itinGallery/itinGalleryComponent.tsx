import React from 'react';
import styles from './itinGalleryComponent.module.css';
import { Itinerary  } from './itinGalTypeDefs';
import {useRouter} from 'next/router';


type Props = {
  itinId: string,
  userId: string,
  title: string,
  description: string,
  neighborhood: string,
  city: string,
  state: string,
  duration: string,
  imageUrl: string,
}


const ItinGalleryComponent: React.FC<Props> = ({...props}) => {
  const router = useRouter();

  return (
    <div className={styles.container} onClick={() => router.push(`/viewPublicItinerary/${props.itinId}`)}
    style={{ border: '1px solid #e0e0e0', borderRadius: '10px', margin: '10px' }}>
      <div className={styles.image}
      style=
      {{ width: '100%', height: '200px', backgroundImage: 
      `url(${props.imageUrl})`, 
      backgroundSize: 'cover', backgroundPosition: 'center' }}>

      </div>
      
      <div>
        <h5 className={styles.title}>{props.title}</h5>
        <p className={styles.text}>{props.description}</p>
    
        {/* <p className={styles.text}><strong>Duration:</strong> {duration}</p> */}
      </div>
    </div>
  );
};

export default ItinGalleryComponent;
