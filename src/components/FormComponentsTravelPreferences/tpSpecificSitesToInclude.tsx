import React, { useState, useRef } from "react";
import {TextField, IconButton} from "@mui/material";
import { styled } from '@mui/material/styles';
import { TripPreferences } from "@/components/typeDefs";  
import { useRecoilState } from "recoil";
import { tripPreferencesAtom} from "@/atoms/atoms";
import styles from './tpSpecificSitesToInclude.module.css';
import ViewAllSpecificSites from "./viewAllSpecificSites";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faPlus } from '@fortawesome/free-solid-svg-icons';

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

const SpecificSitesToIncludeInput: React.FC<TripPreferences> = (props) => {
    const [tripPreferences, setTripPreferencesAtom] = useRecoilState(tripPreferencesAtom);
    const maxLength = 50;
    const[specificSitesToIncludeInput, setSpecificSitesToIncludeInput] = useState<string>("");
    
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if(specificSitesToIncludeInput.length<maxLength){
      setSpecificSitesToIncludeInput(newValue);
        }
    };
    
    const handleAddSpecificSitesToInclude = (specificSitesToIncludeInput:string) => {
       if(specificSitesToIncludeInput.length>0){ 
        setTripPreferencesAtom((prevTripPreferenceState)=> 
        ({...prevTripPreferenceState,   
            specificSitesToInclude: [...(prevTripPreferenceState.specificSitesToInclude)
                ?? [], specificSitesToIncludeInput]}));
        setSpecificSitesToIncludeInput("");}
    }

    
    const [showViewAllSpecificSites, setShowViewAllSpecificSites] = useState(false);
    
    const handleClick = () => {
        setShowViewAllSpecificSites(true);
    };
    
    const handleClose = () => {
        setShowViewAllSpecificSites(false);
    };

    const helperText = () => {
      const places = tripPreferences.specificSitesToInclude;
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
    <div className={styles.specificSitesToIncludeContainer}>
        <PinkOutlinedTextField
        label="specific site to include"
        value={specificSitesToIncludeInput}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        size="small"
        inputRef={inputRef}
        helperText={helperText()}
        />
        <div style={{display:"flex", flexDirection:"row", width:'3rem'}}>
           
            <IconButton  
              onClick={()=>handleAddSpecificSitesToInclude(specificSitesToIncludeInput)}
              >
              <FontAwesomeIcon icon={faPlus} size="xs"/>
            </IconButton>
            
            {showViewAllSpecificSites ? (
                <ViewAllSpecificSites handleClose={handleClose} />
            ) : (
                <IconButton onClick={handleClick}>
                  <FontAwesomeIcon icon={faEye} size="xs"/>
                </IconButton>
            )}
        </div>
    </div>
  );
};

export default SpecificSitesToIncludeInput;
