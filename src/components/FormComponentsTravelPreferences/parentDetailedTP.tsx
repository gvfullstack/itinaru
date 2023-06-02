import React, { useState } from 'react';
import {
  useRecoilState,
  RecoilState,
} from 'recoil';
import {
  curStepState,
  userPreferencesAtom
} from '../../atoms/atoms';
const { v4: uuidv4 } = require('uuid');
import { UserPreferences } from '../typeDefs';
import ExperienceSoughtThisTrip from './tpExperienceSoughtInput';
import SpecificSitesToIncludeInput from './tpSpecificSitesToInclude';

const DetailedTravelPreferences = (props: any) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const togglePreferences = () => {
    setShowPreferences((prevShowPreferences) => !prevShowPreferences);
  };

  return (
    <div style={{ borderTop:'none', borderBottom: 'none', margin: '0rem', maxWidth:"20rem", alignSelf: "center"}}>      
      <div style={{ padding: '10px' }}>
              <div style={{display:"flexbox", textAlign: "left", margin: "0rem"}}>
                <a
                  href="#"
                  onClick={togglePreferences}
                  style={{
                    color: 'grey',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  {showPreferences ? 'collapse travel preferences' : 'travel preferences'}
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
