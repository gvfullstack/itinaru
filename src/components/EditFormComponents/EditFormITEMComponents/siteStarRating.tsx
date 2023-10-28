import React from 'react';
import { Star, StarBorder, Clear, Style } from '@mui/icons-material'; 
import { ItineraryItem } from '../editFormTypeDefs';
import Button from '@mui/material/Button'; // Import MUI Button

type StarRatingProps = {
  initialItem: ItineraryItem | undefined;
  updateItemInRecoilState: (updatedFields: Partial<ItineraryItem>, itemId: string) => void;
};
const StarRating: React.FC<StarRatingProps> = ({ initialItem, updateItemInRecoilState }) => {
  
  const handleRating = (ratingValue: number) => {
    updateItemInRecoilState({ rating: ratingValue }, initialItem?.id || '');
  };

  const clearRating = () => {
    updateItemInRecoilState({ rating: 0 }, initialItem?.id || '');
  };


  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= (initialItem?.rating || 0)) {
        stars.push(
          <Star
            key={i}
            style={{ cursor: 'pointer', color: 'yellow', fontSize: '3rem' }} 
            onClick={() => handleRating(i)}
          />
        );
      } else {
        stars.push(
          <StarBorder
            key={i}
            style={{ cursor: 'pointer', fontSize: '3rem' }}
            onClick={() => handleRating(i)}
          />
        );
      }
    }
    return stars;
  };



  return (
    <>
    <div style={{display:'flex', flexDirection:"column"}}>
      
      <div style={{display: "flex", marginTop:".5rem", gap:".5rem", }}>
      <p>Creator's Rating:</p>{renderStars()}
      </div>
      <Button 
        startIcon={<Clear />} 
        onClick={clearRating}
        size="small"
        style={{ width: '8rem', padding: '0', display: "flex", gap:"0"}}
      >
        Clear Rating
      </Button>
    </div>
    </>
  );
};

export default StarRating;
