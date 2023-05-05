import { Component, useCallback, useState, useEffect } from 'react';
import * as React from 'react';
import { GoogleMap, LoadScript, Marker, Polygon, OverlayView } from "@react-google-maps/api";
import {
  useRecoilState,
} from 'recoil';
import styles from "./itinBuilderCSS/mapComponent.module.css";
import { neighborhoodsState } from "../../src/atoms/atoms"
import { Neighborhoods } from "../../src/typeDefs/index";

const { v4: uuidv4 } = require('uuid');


const center = {
  lat: 32.7157,
  lng: -117.1611,
};


const myAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const options = {
  gestureHandling: 'greedy',
  mapId: "8f57db831e8da641"
};


const MapsComponent = (props: any) => {

  const [neighborhoods, setNeighborhoodsState] = useRecoilState(neighborhoodsState);
  

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
    
}, [neighborhoods])

const handleOptionSelect = (neighborhood: Neighborhoods) => {
  setNeighborhoodsState(prevState => {
    const neighborhoods = prevState.map((stateNeighborhood: Neighborhoods) => {
      if(stateNeighborhood.neighborhood === neighborhood.neighborhood) {
        return {...stateNeighborhood, selected: !stateNeighborhood.selected}
      }
      else {return stateNeighborhood}
    })
    return neighborhoods
  })
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
              zoom={8}
              options={options}>
              {neighborhoods.map((neighborhood: any) =>
                typeof neighborhood === 'object' && neighborhood.loc ? (
                  <React.Fragment key={key + uuidv4()}>
                    <Polygon
                      paths={neighborhood.loc}
                      options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: neighborhood.selected ? "#FC4869":'#FF7890',
                        fillOpacity: 0.35,
                      }}
                     
                    />
                    <OverlayView
                      position={{
                        lat: neighborhood.loc[0].lat,
                        lng: neighborhood.loc[0].lng,
                      }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={getPixelPositionOffset}
                    >
                      <div
                        style={{
                          background: neighborhood.selected ? "#FC4869":'#FF7890'  ,
                          color: 'white',
                          border: 'none',
                          borderRadius: '20rem',
                          padding: 5,
                        }}
                         onClick={() =>
                          handleOptionSelect(neighborhood)
                      }
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
