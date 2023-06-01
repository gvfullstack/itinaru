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
    <div className={styles.wrapper}>
      <div
        className={`${styles.content} ${showPreferences ? styles.open : styles.close}`}
        style={{
          maxHeight: showPreferences ? '2000px' : '0',
          transition: 'max-height 1s ease',
        }}
      >
        {showPreferences && (
          <div>
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
        {showPreferences ? 'hide user preferences' : 'user preferences'}
      </a>
    </div>
  );
};

export default ParentUserPreferencesComponent;
