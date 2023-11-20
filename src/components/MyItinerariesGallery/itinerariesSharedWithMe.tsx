import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authUserState } from '../../atoms/atoms';
import {fetchSharedItineraries} from './myItineraryUtilityFunctions/fetchSharedItineraries';
import { ItineraryAccess  } from '../EditFormComponents/editFormTypeDefs';  // Replace with the actual import path
import {itineraryAccess} from '../EditFormComponents/editFormAtoms'; // Replace with the actual import path
import ItinGalCompWrapper from './itinGallerySubComponents/itinGalCompWrapper';
import SharedItinGalleryComponent from './itinGallerySubComponents/sharedItinGalleryComponent';

import { openDB } from 'idb';
import { it } from 'node:test';

const SharedItineraries: React.FC = () => {

    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [sharedItineraries, setSharedItineraries] = useRecoilState<ItineraryAccess>(itineraryAccess);
  
    const userId = authUser?.uid as string;
  
    useEffect(() => {
      const fetchData = async () => {
        const itineraries = await fetchSharedItineraries(userId);
        if (itineraries !== undefined) {
          setSharedItineraries(itineraries);
      };
    }
      fetchData();      
    }, []);

  
    return (
      <div>
        <ItinGalCompWrapper>
          {sharedItineraries && sharedItineraries.map((itin, index) => (
            <SharedItinGalleryComponent 
              key={index}
              itinerary={itin}  // Modify ItinGalleryComponent if needed to accept the type from itineraryAccess
            />
          ))}
        </ItinGalCompWrapper>
      </div>
    );
  };
  
  export default SharedItineraries;