import React, { Component, useCallback, useState } from 'react';
import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon, OverlayView   } from "@react-google-maps/api";

import styles from "./mapComponent.module.css";

const { v4: uuidv4 } = require('uuid');
  
  const center = {
    lat: 37.3688,
    lng: -122.0363,
  };
 
type MultiSelectHandler = (key: string, value: any) => void;

interface Neighborhoods {
  neighborhood: string;
  coordinates: { lat: number, lng: number }[];
}

type PageComponentProps = {
  multipleSelectObjects?: string[] | Neighborhoods[];
  selectedNeighborhoods?: string[];
  keyOfMultiSelectButton?: string;
  handleMultiSelect?: MultiSelectHandler; 

}   

const myAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const options = {
  gestureHandling: 'greedy',
  mapId: "8f57db831e8da641"
};


const MapsComponent: React.FC<PageComponentProps> = (props) => {

  const neighborhoods = props.multipleSelectObjects ? props.multipleSelectObjects : [];
  const selectedNeighborhoods = props.selectedNeighborhoods ? props.selectedNeighborhoods : [];  
  const keyOfMultiSelectButton = props.keyOfMultiSelectButton ? props.keyOfMultiSelectButton : "";
  const handleMultiSelect = props.handleMultiSelect ? props.handleMultiSelect : () => {};

  const getPixelPositionOffset = (width:number, height:number) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  const [key, setKey] = useState(uuidv4());
  
  const handleMapLoad = () => {
    setKey(uuidv4());
  }

  const handlePolygonClick = (key: string, value: any) => {
  console.log(key)    
  handleMultiSelect(key, value)}

  return (
    <LoadScript
      googleMapsApiKey={myAPIKEY}
    >
    <React.Fragment>

      <GoogleMap 
        onLoad={handleMapLoad} 
        mapContainerClassName	={styles.mapsContainer} 
        center={center} 
        zoom={15} 
        options={options}>
          { neighborhoods.map((neighborhood) =>
              typeof neighborhood === 'object' && neighborhood.coordinates ? (
                <React.Fragment key={key+uuidv4()}>
                  <Polygon
                    paths={neighborhood.coordinates}
                    options={{
                      strokeColor: '#FC4869',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: selectedNeighborhoods.includes(
                        neighborhood.neighborhood) ? '#FC4869' : "none",
                      fillOpacity: 0.35,
                    }}
                    onClick={() =>
                      handlePolygonClick(keyOfMultiSelectButton, neighborhood.neighborhood)
                    }
                  />
                  <OverlayView
                    position={{
                      lat: neighborhood.coordinates[0].lat,
                      lng: neighborhood.coordinates[0].lng,
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPixelPositionOffset}
                  >
                    <div
                      style={{
                        background: '#FC4869',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20rem',
                        padding: 5,
                      }}
                    >
                      {neighborhood.neighborhood}
                    </div>
                  </OverlayView>
                </React.Fragment>
          ) : null
        )}
      </GoogleMap>
      </React.Fragment>
    </LoadScript>
  )
}

export default React.memo(MapsComponent);

