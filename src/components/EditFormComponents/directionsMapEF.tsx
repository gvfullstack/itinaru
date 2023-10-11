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

  if (items.length < 2) {
    return null;
  } 
  const waypoints = items
  .map((item) => getLocationString(item))
  .filter(Boolean);
// Set origin and destination based on the waypoints
  const origin = waypoints[0] || getLocationString(items[0]);
  const destination = waypoints[waypoints.length - 1] || getLocationString(items[items.length - 1]);

  // Initialize Google Maps URL
  let googleMapURL = `https://www.google.com/maps/embed/v1/directions?key=${'AIzaSyDI6tYErd_J2V4l0yQvj6ug4hYSMmeCMJ0'}&origin=${origin}&destination=${destination}`;

  // Add waypoints to the URL if there are more than two
  if (waypoints.length > 1) {
    googleMapURL += `&waypoints=${waypoints.join('|')}`;
  }

  return (
    <div className={styles.mapContainer}>
      <iframe className={styles.mapIframe} height="100%" width="100%" 
      src={googleMapURL} allowFullScreen />
    </div>
  );
};


function getLocationString(item: ItineraryItem): string | null {
  if (item.locationAddress) {
    console.log(item.locationAddress, 'item.locationAddress exists', item)
    return encodeURIComponent(item.locationAddress);
  } else if (item.location?.latitude && item.location?.longitude) {
    console.log(item.location, 'item.location exists', item)
    return `${item.location.latitude},${item.location.longitude}`;
  } else {
    console.log('item.locationAddress and item.location do not exist')
    return null;
  }
}

export default GoogleMapIframe;