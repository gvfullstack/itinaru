import React from 'react';
import styles from './itinGalleryComponent.module.css';
import { ItineraryData  } from '../typeDefs/index';

const ItinGalleryComponent: React.FC<ItineraryData> = ({ title,
  description,
  neighborhood,
  city,
  state,
  duration,
  imageUrl 
}) => {
  return (
    <div className={styles.container}
    style={{ border: '1px solid #e0e0e0', borderRadius: '10px', margin: '10px' }}>
      <div className={styles.image}
      style=
      {{ width: '100%', height: '200px', backgroundImage: 
      `url(${imageUrl})`, 
      backgroundSize: 'cover', backgroundPosition: 'center' }}>

      </div>
      
      <div>
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.text}>{description}</p>
        <p className={styles.text}>{neighborhood}, {city}, {state}</p>
        <p className={styles.text}><strong>Duration:</strong> {duration}</p>
      </div>
    </div>
  );
};

export default ItinGalleryComponent;
