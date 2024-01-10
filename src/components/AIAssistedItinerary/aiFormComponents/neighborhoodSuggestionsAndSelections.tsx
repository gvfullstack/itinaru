import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { neighborhoodRecommendationList, tripPreferencesAtom } from '../aiItinAtoms';
import { NeighborhoodRecommendation, NeighborhoodRecommendationList} from '../aiItinTypeDefs';
import {DynamicFontAwesomeIcon} from '@/components';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import styles from '../aiItinBuilderCSS/NeighborhoodRecommendations.module.css';

const NeighborhoodRecommendations: React.FC<NeighborhoodRecommendationList> = () => {
  const [neighborhoodRecommendations, setNeighborhoodRecommendations] = useRecoilState<NeighborhoodRecommendationList>(
    neighborhoodRecommendationList
  );
  const { selectedIndicesAtom, hoverIndexAtom } = neighborhoodRecommendations;
  const neighborhoodRecommendationArray = neighborhoodRecommendations.neighborhoodRecommendationArray?? [];
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
 
  const handleClick = (index: number) => {
    const selectedIndices = selectedIndicesAtom?[...selectedIndicesAtom]:[];
  if (selectedIndices.includes(index)) {
    // If the index is already selected, remove it from the selectedIndices array
    const updatedIndices = selectedIndices.filter((i) => i !== index);
    setNeighborhoodRecommendations((prevRecommendations) => ({
      ...prevRecommendations,
      selectedIndicesAtom: updatedIndices,
    }));
  } else {
    // If the index is not selected, add it to the selectedIndices array
    const updatedIndices = [...selectedIndices, index];
    setNeighborhoodRecommendations((prevRecommendations) => ({
      ...prevRecommendations,
      selectedIndicesAtom: updatedIndices,
    }));
  }

    const recommendation = neighborhoodRecommendationArray[index];
    const isAlreadySelected = tripPreferences.neighborhoodsToExplore?.includes(recommendation.title?? '');
    const neighborhoodsToExplore = tripPreferences.neighborhoodsToExplore?? [];

    if (isAlreadySelected) {
      // If the recommendation is already selected, remove it from the neighborhoodSelection
      const updatedSelection = neighborhoodsToExplore.filter((title) => title !== recommendation.title);
      setTripPreferences((prevTripPreferences) => ({
        ...prevTripPreferences,
        neighborhoodsToExplore: updatedSelection,
      }));
    } else {
      // If the recommendation is not selected, add it to the neighborhoodSelection
      const updatedSelection = [...neighborhoodsToExplore, recommendation.title];
      setTripPreferences((prevTripPreferences) => ({
        ...prevTripPreferences,
        neighborhoodsToExplore: updatedSelection as string[],
      }));
    }
  };

  const handleHover = (index: number) => {
    setNeighborhoodRecommendations((prevRecommendations) => ({
      ...prevRecommendations,
      hoverIndexAtom: index,
    }));
  };
  
  const handleMouseLeave = () => {
    setNeighborhoodRecommendations((prevRecommendations) => ({
      ...prevRecommendations,
      hoverIndexAtom: null,
    }));
  };


  return (
    <>
      <p>*Optionally select neighborhood(s) to focus your travels.</p>
      <div className={styles.container}>
        {neighborhoodRecommendationArray?.map((recommendation: NeighborhoodRecommendation, index: number) => {
          const isSelected = selectedIndicesAtom?.includes(index);
          const isHovered = hoverIndexAtom === index;
          return (
            <div
              key={index}
              className={`${styles.card} ${isSelected ? styles.cardActive : ''} ${
                isHovered ? styles.cardHover : ''
              }`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className={styles.rating}>
                {recommendation.rating === 'Top Match' && (
                  <DynamicFontAwesomeIcon className={styles.icon} icon={faMedal} />
                )}
                {recommendation.rating}
                {isSelected && <p className={styles.selectedText}>Selected</p>}
              </h3>
              <h2 className={styles.title}>{recommendation.title}</h2>
              <p className={styles.description}>{recommendation.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NeighborhoodRecommendations;
