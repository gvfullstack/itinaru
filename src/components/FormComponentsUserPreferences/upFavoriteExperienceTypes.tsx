import React, { useState, useEffect, useCallback } from "react";
const { v4: uuidv4 } = require('uuid');
import { userPreferencesAtom } from '../../atoms/atoms';
import { useRecoilState } from 'recoil';

type Option = {
  label: string;
  selected: boolean;
}

const FavoriteExperienceTypes: React.FC = (props) => {

  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const favoriteExperienceTypes = userPreferences.favoriteExperienceTypes;

  const handleToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setUserPreferences(prevUserPreferences => ({
      ...prevUserPreferences,
      favoriteExperienceTypes: prevUserPreferences.favoriteExperienceTypes.map(option => {
        if (option.label === value) {
          return { ...option, selected: checked };
        }
        return option;
      })
    }));
  }, [setUserPreferences]);

  return (
    <div>
    Favorite Experience Types
      {favoriteExperienceTypes.map(option => (
        <label key={uuidv4()} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            value={option.label}
            checked={option.selected}
            onChange={handleToggleChange}
            style={{ display: 'none' }}
          />
          <div
            className="toggle-switch"
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              background: option.selected ? 'green' : 'grey',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div
              className="toggle-slider"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '50%',
                left: option.selected ? 'calc(100% - 20px)' :    '5px',
                transform: 'translateY(-50%)',
                transition: 'left 0.3s ease',
              }}
            ></div>
          </div>
          <span style={{ marginLeft: '10px' }}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default FavoriteExperienceTypes;
