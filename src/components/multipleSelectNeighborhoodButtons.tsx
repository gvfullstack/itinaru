import React, { useState } from "react";
import styles from "./itinBuilderCSS/multipleSelectNeighborhoodButton.module.css";
import { v4 as uuidv4 } from 'uuid';
import { useRecoilState } from 'recoil';
import { neighborhoodsState } from "../../src/atoms/atoms";
import { Neighborhoods } from "../../src/typeDefs/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const element = <FontAwesomeIcon icon={faCaretDown} />;

const MultipleSelectNeighborhoodButtons: React.FC = () => {
  const [neighborhoods, setNeighborhoodsState] = useRecoilState<Neighborhoods[]>(neighborhoodsState);

  const handleOptionSelect = (neighborhood: Neighborhoods) => {
    setNeighborhoodsState(prevState => {
      const updatedNeighborhoods = prevState.map((stateNeighborhood) => {
        if(stateNeighborhood.neighborhood === neighborhood.neighborhood) {
          return {...stateNeighborhood, selected: !stateNeighborhood.selected}
        }
        else {       
          return stateNeighborhood}
      })
      return updatedNeighborhoods;
    });
  }

  
  const handleShowHideDescription = (neighborhood: Neighborhoods) => {
    setNeighborhoodsState(prevState => {
      const updatedNeighborhoods = prevState.map((stateNeighborhood) => {
        if(stateNeighborhood.neighborhood === neighborhood.neighborhood) {
          return {...stateNeighborhood, descHidden: !stateNeighborhood.descHidden}
        }
        else {       
          return stateNeighborhood}
      })
      return updatedNeighborhoods;
    });
  };
    
  return (
    <div className={styles.multiSelectButtonContainer}>
      {neighborhoods.map((neighborhood: Neighborhoods) => (
        <div key={uuidv4()} className={styles.buttonAndDescContainer}>
          {neighborhood.neighborhood && (
            <div className={`${styles.buttonContainer} ${neighborhood.selected ? styles.selected : ""}`}>
              <button
                onClick={() => handleOptionSelect(neighborhood)}
                className={styles.multiSelectButton}
              >
                {neighborhood.neighborhood}
              </button>
              <div className={styles.caretContainer} 
                onClick={() => handleShowHideDescription(neighborhood)}> 
                {element}
              </div>
            </div>
          )}
  
          <div 
           className={`${styles.extendedDescription} ${neighborhood.descHidden ? "" : styles.isShown}`}
           onClick={() => handleShowHideDescription(neighborhood)}
            >
            <p>{neighborhood.desc}</p>
          </div>
  
        </div>
      ))}
    </div>
  );
};

export default MultipleSelectNeighborhoodButtons;