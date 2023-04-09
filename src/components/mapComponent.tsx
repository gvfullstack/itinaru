import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import styles from "./mapComponent.module.css";



export default function MapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) return <div>Error loading map</div>;

  if(!isLoaded) return <div>Loading...</div>

  function Map(){
    return <div className={styles.mapsContainer}><GoogleMap 
                zoom={10} 
                center={{lat: 37.7749, lng: -122.4194}} 
                mapContainerClassName={styles.map}
            >
                <Marker position={{lat: 37.7749, lng: -122.4194}}/>
            </GoogleMap></div>
  }
  return <Map />
  }
