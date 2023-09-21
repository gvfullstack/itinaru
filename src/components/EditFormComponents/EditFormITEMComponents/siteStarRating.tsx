import React from 'react';
import { Star, StarBorder, Clear } from '@mui/icons-material'; 
import { ItineraryItem } from '@/components/typeDefs/index';
import Button from '@mui/material/Button'; // Import MUI Button

type StarRatingProps = {
  currentItem: ItineraryItem;
  setCurrentItem: React.Dispatch<React.SetStateAction<ItineraryItem>>;
};

const StarRating: React.FC<StarRatingProps> = ({ currentItem, setCurrentItem }) => {
  const handleRating = (rating: number) => {
    setCurrentItem((prev) => ({
      ...prev,
      rating
    }));
  };

  const clearRating = () => {
    setCurrentItem((prev) => ({
      ...prev,
      rating: 0
    }));
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= (currentItem.rating || 0)) {
        stars.push(
          <Star
            key={i}
            style={{ cursor: 'pointer', color: 'yellow' }} 
            onClick={() => handleRating(i)}
          />
        );
      } else {
        stars.push(
          <StarBorder
            key={i}
            style={{ cursor: 'pointer' }}
            onClick={() => handleRating(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <>
    <div>Rating:</div>
    <div style={{display: "flex", marginTop:".5rem"}}>
      {renderStars()}
      <Button 
        startIcon={<Clear />} 
        onClick={clearRating}
        size="small"
        style={{ marginLeft: '10px' }}
      >
        Clear Rating
      </Button>
    </div>
    </>
  );
};

export default StarRating;