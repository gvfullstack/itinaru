import React, { useState, useRef } from "react";
import {TextField, IconButton} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useRecoilState } from "recoil";
import { userPreferencesAtom} from "../../aiItinAtoms";
import ViewAllFavRestaurantsPrevVisited from "./viewAllFavRestaurantsPrevVisited";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';


const PinkOutlinedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    borderRadius: '30px',
    borderColor: 'pink',
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '18px',
    fontWeight: '400',
    padding: '10px 10px 10px 20px' ,
  },
  width: "75%",
  maxWidth: '17.5rem',
  alignSelf: 'center',
}));

const FavoriteRestaurantsPreviouslyVisited: React.FC = (props) => {
    const [userPreferences, setUserPreferencesAtom] = useRecoilState(userPreferencesAtom);
    const maxLength = 50;
    const[favRestaurantsPrevVisitedInput, setFavRestaurantsPrevVisiteInput] = useState<string>("");
    
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if(favRestaurantsPrevVisitedInput.length<maxLength){
        setFavRestaurantsPrevVisiteInput(newValue);
        }
    };
    
    const handleAddFavoriteRestaurantsPreviouslyVisited = (ViewAllFavRestaurantsPrevVisited:string) => {
       if(favRestaurantsPrevVisitedInput.length>0){ 
        setUserPreferencesAtom((prevUserPreferenceState)=> 
        ({...prevUserPreferenceState,   
          favoriteRestaurantsPreviouslyVisited: [...(prevUserPreferenceState.favoriteRestaurantsPreviouslyVisited)
                ?? [], favRestaurantsPrevVisitedInput]}));
          setFavRestaurantsPrevVisiteInput("");}
    }

    const [showViewAllFavRestaurantsPrevVisited, setShowViewAllFavRestaurantsPrevVisited] = useState(false);
    
    const handleClick = () => {
      setShowViewAllFavRestaurantsPrevVisited(true);
    };
    
    const handleClose = () => {
      setShowViewAllFavRestaurantsPrevVisited(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if(event.key === 'Enter'){
          handleAddFavoriteRestaurantsPreviouslyVisited(favRestaurantsPrevVisitedInput);
      }
  };

  const helperText = () => {
    const places = userPreferences.favoriteRestaurantsPreviouslyVisited;
    // Check if the places array is not empty
    if (places && places.length > 0) {
      // Take the first few items (or one item) up to 30 characters
      let text = places.slice(0, 3).join(', ');
      // Limit to 30 characters
      if (text.length > 30) {
        text = text.substring(0, 35) + '...';
      }
      return text;
    } else {
      return '';
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '10px'}}>
    <PinkOutlinedTextField
        label="favorite restaurant previously visited"
        value={favRestaurantsPrevVisitedInput}
        onChange={handleChange}
        onKeyPress={handleKeyPress} // added this line
        fullWidth
        margin="normal"
        variant="outlined"
        size="small"
        inputRef={inputRef}
        helperText={helperText()}
    />
    <div style={{display:"flex", flexDirection:"row", width:'3rem'}}>
        <IconButton 
            onClick={()=>handleAddFavoriteRestaurantsPreviouslyVisited(favRestaurantsPrevVisitedInput)}
        >
            <FontAwesomeIcon icon={faPlus} size="xs"/>
        </IconButton>
    
    {showViewAllFavRestaurantsPrevVisited ? (
        <ViewAllFavRestaurantsPrevVisited handleClose={handleClose} />
    ) : (
        <IconButton onClick={handleClick}>
            <FontAwesomeIcon icon={faEye} size="xs"/>
        </IconButton>
    )}
</div>
    </div>
  );
};

export default FavoriteRestaurantsPreviouslyVisited;
