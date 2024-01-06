import React from 'react';
import { Star, StarBorder } from '@mui/icons-material'; 
import { ItineraryItem } from '../editFormTypeDefs';

type StaticStarRatingProps = {
  starRating: number | undefined;
};

const StaticStarRating: React.FC<StaticStarRatingProps> = ({ starRating }) => {
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= (starRating || 0)) {
        stars.push(
          <Star
            key={i}
            style={{ color: 'yellow', fontSize: '2.5rem' }} 
          />
        );
      } else {
        stars.push(
          <StarBorder
            key={i}
            style={{ fontSize: '2.5rem' }}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div style={{display:'flex', flexDirection:"column"}}>
      <div style={{display: "flex", marginTop:".5rem", gap:".5rem"}}>
        <p>Creator&apos;s Rating:</p>
        {renderStars()}
      </div>
    </div>
  );
};

export default StaticStarRating;
