import { Component, useCallback, useState, useEffect } from 'react';
import * as React from 'react';

import { GoogleMap, LoadScript, Marker, Polygon, OverlayView } from "@react-google-maps/api";
import {
  useRecoilValue,
} from 'recoil';

import styles from "./mapComponent.module.css";
import { neighborhoodsState, selectedNeighborhoodsState, keyOfMultiSelectButtonState, handleMultiSelectState } from "../../src/pages"

const { v4: uuidv4 } = require('uuid');

const center = {
  lat: 37.3688,
  lng: -122.0363,
};

// type MultiSelectHandler = (key: string, value: any) => void;


const myAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const options = {
  gestureHandling: 'greedy',
};

let count = 0;
const countAdder = () => count + 1
countAdder()
// console.log("count", count)

const MapsComponent = (props: any) => {

  const neighborhoods = useRecoilValue(neighborhoodsState);
  const selectedNeighborhoods = useRecoilValue(selectedNeighborhoodsState);
  const keyOfMultiSelectButton = useRecoilValue(keyOfMultiSelectButtonState);
  // const handleMultiSelect = props.handleMultiSelect ? props.handleMultiSelect : () => {};

  useEffect(() => {
  console.log('maps neighborhoods - ' + neighborhoods)
  }, [neighborhoods]);

  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  const [key, setKey] = useState(uuidv4());

  const handleMapLoad = () => {
    setKey(uuidv4());
  }

  useEffect(()=> {
   console.log("map rendered")
   console.log("neighborhoods " + JSON.stringify(neighborhoods))
   console.log("selectedNeighborhoods " + selectedNeighborhoods)
    
}, [neighborhoods, selectedNeighborhoods])

  const handlePolygonClick = (key: string, value: any) => {
    // console.log(key)
    // handleMultiSelect(key, value)}
  }
    return (
      <>
        <LoadScript
          googleMapsApiKey={myAPIKEY}
        >
          <React.Fragment>

            <GoogleMap
              onLoad={handleMapLoad}
              mapContainerClassName={styles.mapsContainer}
              center={center}
              zoom={15}
              options={options}>
              {neighborhoods.map((neighborhood: any) =>
                typeof neighborhood === 'object' && neighborhood.coordinates ? (
                  <React.Fragment key={key + uuidv4()}>
                    <Polygon
                      paths={neighborhood.coordinates}
                      options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: selectedNeighborhoods.includes(
                          neighborhood.neighborhood) ? '#FF0000' : "#00FF30",
                        fillOpacity: 0.35,
                      }}
                      // onClick={() =>
                      //   handlePolygonClick(keyOfMultiSelectButton, neighborhood.neighborhood)
                      // }
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
      </>
    )
  }


export default MapsComponent;
