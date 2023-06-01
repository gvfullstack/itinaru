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
    <div style={{ borderTop: showPreferences?'1px solid grey':'none', borderBottom: showPreferences?'1px solid grey':'none', marginTop: '1rem', }}>      
      <div style={{ padding: '10px' }}>
        
        {showPreferences && (
          <div>
            <h4 style={{color: "grey"}}>travel preferences</h4>
            <SpecificSitesToIncludeInput />
            <ExperienceSoughtThisTrip />
          </div>
        )}
        <a
          href="#"
          onClick={togglePreferences}
          style={{
            color: 'grey',
            cursor: 'pointer',
            textDecoration: 'none',
            textAlign: 'left',
            width: '100%',
          }}
        >
          {showPreferences ? 'collapse travel preferences' : 'travel preferences'}
        </a>
      </div>
    </div>
  );
};

export default DetailedTravelPreferences;
