import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { neighborhoodRecommendationList, tripPreferencesAtom } from '../atoms/atoms';
import { NeighborhoodRecommendation, NeighborhoodRecommendationList} from './typeDefs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import styles from './NeighborhoodRecommendations.module.css';

const NeighborhoodRecommendations: React.FC<NeighborhoodRecommendationList> = () => {
  const [neighborhoodRecommendations, setNeighborhoodRecommendations] = useRecoilState<NeighborhoodRecommendationList>(
    neighborhoodRecommendationList
  );
  const neighborhoodRecommendationArray = neighborhoodRecommendations.neighborhoodRecommendationArray?? [];
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);


  const handleClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      // If the index is already selected, remove it from the selectedIndices array
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      // If the index is not selected, add it to the selectedIndices array
      setSelectedIndices([...selectedIndices, index]);
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
    console.log(tripPreferences);
  };

  const handleHover = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };


  return (
    <div className={styles.container}>
      {neighborhoodRecommendationArray?.map((recommendation: NeighborhoodRecommendation, index: number) => {
        const isSelected = selectedIndices.includes(index);
        const isHovered = hoverIndex === index;
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
                <FontAwesomeIcon className={styles.icon} icon={faMedal} />
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
  );
};

export default NeighborhoodRecommendations;
