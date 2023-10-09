import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ItineraryItem } from './editFormTypeDefs';
import { currentlyEditingItineraryState } from './editFormAtoms';
import styles from './EditFormCSS/itineraryEditForm.module.css';

const GoogleMapIframe: FC = () => {
  const itinerary = useRecoilValue(currentlyEditingItineraryState);
  const items = itinerary.items ?? [];

  if (items.length < 2) {
    return null;
  }

  let origin;
  if (items) {
      origin = getLocationString(items[0]);
  }
  
  let destination;
  if (items) {
    destination = getLocationString(items[items.length - 1]);
  }
    
  let googleMapURL = `https://www.google.com/maps/embed/v1/directions?key=${'AIzaSyDI6tYErd_J2V4l0yQvj6ug4hYSMmeCMJ0'}&origin=${origin}&destination=${destination}`;

  if (items.length > 2) {
    const waypoints = items
      .slice(1, -1)
      .map((item) => getLocationString(item))
      .join('|');
      
    googleMapURL += `&waypoints=${waypoints}`;
  }

  return (
    <div className={styles.mapContainer}>
      <iframe className={styles.mapIframe} height="100%" width="100%" 
      src={googleMapURL} allowFullScreen />
    </div>
  );
};


function getLocationString(item: ItineraryItem): string {
  if (item.locationAddress) {
    return encodeURIComponent(item.locationAddress);
  } else {
    return `${item.location?.latitude},${item.location?.longitude}`;
  }
}

export default GoogleMapIframe;