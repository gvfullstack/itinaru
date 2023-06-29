import React, { useState } from 'react';
import {
  useRecoilState,
} from 'recoil';
import {tripPreferencesAtom
} from '../../atoms/atoms';
const { v4: uuidv4 } = require('uuid');
import UserInputTimePicker from "../FormComponentsTravelPreferences/tpTimePicker";
import UserInputDatePicker from "../FormComponentsTravelPreferences/tpDatePicker";
import DestinationInput from "../FormComponentsTravelPreferences/tpDestinationInput";

const GeneralTravelPreferences = (props: any) => {
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom)
  const showTripInfo = tripPreferences.showTripInfo ? tripPreferences.showTripInfo : false

  const togglePreferences = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setTripPreferences(prev => ({...prev, showTripInfo: !prev.showTripInfo}))
  };

  return (
    <div style={{ maxWidth: "20rem", alignSelf: "center", display: 'flex', flexDirection: 'column', padding: '0 10px'}}>      
              <div style={{ width: '100%'}}>
                <a
                  href="#"
                  onClick={togglePreferences}
                  style={{
                    color: showTripInfo ? '#FC4869':'grey',
                    cursor: 'pointer',
                    width: '100%',
                    textDecorationLine: showTripInfo ? 'underline': 'none', 
                    textAlign: showTripInfo ? "left":"center",
                  }}
                >
                  {showTripInfo ? 'collapse trip info' : 'trip info'}
                </a>
              </div>
              <div>
        {showTripInfo && (
          <div>       
              <div style={{margin:"10rem, 0rem"}}>
                <DestinationInput />
              </div>       
              <UserInputDatePicker />
              <UserInputTimePicker />
          </div>
        )}
        </div>
    </div>
  );
};

export default GeneralTravelPreferences;
