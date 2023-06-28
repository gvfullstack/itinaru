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
  const [userPreferencesVal, setUserPreferencesVal] = useRecoilState(userPreferencesAtom)
  const showPreferences = userPreferencesVal.showUserPreferences ? userPreferencesVal.showUserPreferences : false

  const togglePreferences = () => {
    setUserPreferencesVal(prev => ({...prev, showUserPreferences: !prev.showUserPreferences}))
  };

  return (
    <div style={{ borderTop:'none', borderBottom: 'none', margin: '0rem 0rem 0rem 0rem', maxWidth:"20rem", alignSelf: "center"}}>
     <div style={{ padding: '10px 10px 0 0'  }}>
            <div style={{display:"flexbox", textAlign: "left", margin: "0rem"}}>
                <a
                  href="#"
                  onClick={togglePreferences}
                  style={{
                    color: 'grey',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    width: '100%',
                    marginLeft: showPreferences ? ".5rem": "1rem"
                  }}
                >
                  {showPreferences ? 'collapse user preferences' : 'user preferences'}
                </a>
          </div>
        {showPreferences && (
          <div style={{display: "flex", flexDirection:"column", marginTop:"1rem" }}>
            {/* <UserInputCurrencyInputField /> */}
            <FavoriteExperienceTypes />
            <PreferredDiningExperience />
            <PreferredPace />
            <FavoriteCuisine />
            <FavoritePlacesPreviouslyVisited />
            <FavoriteRestaurantsPreviouslyVisited />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentUserPreferencesComponent;
