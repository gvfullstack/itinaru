import React, { useState } from 'react';
import {
  useRecoilState,
} from 'recoil';
import {tripPreferencesAtom
} from '../../../../atoms/atoms';
const { v4: uuidv4 } = require('uuid');
import ExperienceSoughtThisTrip from './tpExperienceSoughtInput';
import SpecificSitesToIncludeInput from './tpSpecificSitesToInclude';

const DetailedTravelPreferences = (props: any) => {
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom)
  const showPreferences = tripPreferences.showTripPreferences ? tripPreferences.showTripPreferences : false

  const togglePreferences = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setTripPreferences(prev => ({...prev, showTripPreferences: !prev.showTripPreferences}))
  };

  return (
    <div style={{ borderTop:'none', borderBottom: 'none', margin: '0rem', maxWidth:"20rem", alignSelf: "center"}}>      
      <div style={{ padding: '10px' }}>
              <div style={{display:"flexbox", textAlign: showPreferences? 'center':'left', margin: "0rem"}}>
                <a
                  href="#"
                  onClick={togglePreferences}
                  style={{
                    color: showPreferences ? '#FC4869':'grey',  
                    cursor: 'pointer',
                    width: '100%',
                    textDecorationLine: showPreferences ? 'underline': 'none',
                  }}
                >
                  {showPreferences ? 'collapse travel preferences' : 'see travel preferences'}
                </a>
              </div>
        {showPreferences && (
            <div>              
            <SpecificSitesToIncludeInput />
            <ExperienceSoughtThisTrip />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default DetailedTravelPreferences;
