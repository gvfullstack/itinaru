import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userPreferencesAtom } from '../../atoms/atoms';
import UserInputCurrencyInputField from './upCurrencyInputField';
import FavoritePlacesPreviouslyVisited from './upFavoritePlacesPreviouslyVisited';
import FavoriteExperienceTypes from './upFavoriteExperienceTypes';
import FavoriteRestaurantsPreviouslyVisited from './upFavoriteRestaurantsPreviouslyVisited';
import PreferredDiningExperience from './upPreferredDiningExperience';
import PreferredPace from './upPreferredPace';
import FavoriteCuisine from './upFavoriteCuisine';
import styles from './parentUPComponent.module.css';

const ParentUserPreferencesComponent = (props: any) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const togglePreferences = () => {
    setShowPreferences((prevShowPreferences) => !prevShowPreferences);
  };

  return (
    <div style={{ borderTop:'none', borderBottom: 'none', margin: '0rem 0rem 0rem 0rem', width:"100%", maxWidth:"22rem", alignSelf: "center"}}>
     <div style={{ padding: '10px 10px 0 0'  }}>
            <div style={{display:"flexbox", textAlign: "left", margin: "0rem"}}>
                <a
                  href="#"
                  onClick={togglePreferences}
                  style={{
                    color: 'grey',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    textAlign: 'left',
                    width: '100%',
                    marginLeft: showPreferences ? ".5rem": "1rem"
                  }}
                >
                  {showPreferences ? 'collapse user preferences' : 'user preferences'}
                </a>
          </div>
        {showPreferences && (
          <div style={{display: "flex", flexDirection:"column", marginTop:"1rem" }}>
            <UserInputCurrencyInputField />
            <FavoritePlacesPreviouslyVisited />
            <FavoriteRestaurantsPreviouslyVisited />
            <FavoriteExperienceTypes />
            <PreferredDiningExperience />
            <PreferredPace />
            <FavoriteCuisine />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentUserPreferencesComponent;
