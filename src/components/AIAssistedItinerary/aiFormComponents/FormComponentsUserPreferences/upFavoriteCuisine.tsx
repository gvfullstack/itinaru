import React, { useState, useEffect, useCallback } from "react";
const { v4: uuidv4 } = require('uuid');
import { userPreferencesAtom } from '../../aiItinAtoms';
import { useRecoilState } from 'recoil';

type Option = {
  label: string;
  selected: boolean;
}

const FavoriteCuisine: React.FC = (props) => {

  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const favoriteCuisineOptions = userPreferences.favoriteCuisine;

  const handleToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setUserPreferences(prevUserPreferences => ({
      ...prevUserPreferences,
      favoriteCuisine: prevUserPreferences.favoriteCuisine?.map(option => {
        if (option.label === value) {
          return { ...option, selected: checked };
        }
        return option;
      })
    }));
  }, [setUserPreferences]);

  return (
    <div>
      <div style={{display:"flex", marginLeft:"1rem", marginBottom:'1rem'}}>
        Preferred Cuisine
      </div>
      {favoriteCuisineOptions?.map(option => (
        <label key={uuidv4()} style={{ display: 'flex', marginBottom: '1rem' }}>
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
              marginLeft: '3rem',

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

export default FavoriteCuisine;
