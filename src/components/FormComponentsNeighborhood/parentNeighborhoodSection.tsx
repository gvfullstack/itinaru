import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { neighborhoodRecommendationList } from '../../atoms/atoms';
import { NeighborhoodRecommendationList } from '../typeDefs';
import GetNeighborhoodSuggestions from '../getNeighborhoodsButton'
import NeighborhoodRecommendations from "../neighborhoodSuggestionsAndSelections";
const { v4: uuidv4 } = require('uuid');

const ParentNeighborhoodSection = (props: any) => {
  const [neighborhoodRecommendations, setNeighborhoodRecommendations] = useRecoilState(neighborhoodRecommendationList);
  const showPreferences = neighborhoodRecommendations.showNeighborhoodSection ? neighborhoodRecommendations.showNeighborhoodSection : false;
  const showNeighborhoodList = neighborhoodRecommendations.showNeighborhoodList ? neighborhoodRecommendations.showNeighborhoodList : false;
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const neighborhoodButtonText = props.getNeigborhoodButtonText

  const togglePreferences = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setNeighborhoodRecommendations((prev: NeighborhoodRecommendationList) => ({
      ...prev,
      showNeighborhoodSection: !prev.showNeighborhoodSection,
    }));
  }
  return (
    <div style={{ borderTop: 'none', borderBottom: 'none', margin: '0rem', maxWidth: '20rem', alignSelf: 'center' }}>
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flexbox', textAlign: 'left', margin: '0rem' }}>
          <a
            href="#"
            onClick={togglePreferences}
            style={{
              cursor: 'pointer',
              width: '100%',
              color: showPreferences ? '#FC4869':'grey',  
              textDecorationLine: showPreferences ? 'underline': 'none',

            }}
          >
            {showPreferences ? 'collapse neighborhood suggestions' : 'neighborhood suggestions'}
          </a>
        </div>
        {showPreferences && (
            <div>
                 {showNeighborhoodList && <NeighborhoodRecommendations/>}
                <GetNeighborhoodSuggestions          
                  handleInputChange={handleInputChange}
                  getNeigborhoodButtonText={neighborhoodButtonText}
                  />
            </div>
        )}
      </div>
    </div>
  );
};

export default ParentNeighborhoodSection;
