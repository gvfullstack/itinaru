import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { itineraryItemsState } from '@/atoms/atoms';
import { ItineraryItem } from './typeDefs';



interface GoogleMapIframeProps {
  apiKey: string;
}
const GoogleMapIframe: FC<GoogleMapIframeProps> = ({ apiKey }) => {
  const itinerary = useRecoilValue(itineraryItemsState);

  if (itinerary.length < 2) {
    return <p>At least two locations are required to generate directions.</p>;
  }

  const origin = getLocationString(itinerary[0]);
  const destination = getLocationString(itinerary[itinerary.length - 1]);

  let waypoints = '';
  if (itinerary.length > 2) {
    waypoints = itinerary
      .slice(1, -1)
      .map((item) => getLocationString(item))
      .join('|');
  }

  const googleMapURL = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;

  return (
    <div style={{padding: '1rem'}}>
      <iframe style={{ maxWidth: '455px' }} width= '100%' height="450" src={googleMapURL} allowFullScreen />
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