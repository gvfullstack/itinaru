import React, { useState, useRef } from "react";
import {TextField} from "@mui/material";
import { styled } from '@mui/material/styles';
import { TripPreferences } from "../../aiItinTypeDefs";  
import { useRecoilState } from "recoil";
import { tripPreferencesAtom} from "../../aiItinAtoms";

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
  width: "90%",
  maxWidth: '20rem',
  alignSelf: 'center',
}));

const ExperienceSoughtThisTrip: React.FC<TripPreferences> = (props) => {
    const [tripPreferences, setTripPreferencesAtom] = useRecoilState(tripPreferencesAtom);
    const whatToGetFromThisTrip = tripPreferences.experienceSoughtThisTrip;
    const [inputLength, setInputLength] = useState(0);
    const maxLength = 255;

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setTripPreferencesAtom((prevTripPreferenceState)=> ({...prevTripPreferenceState, experienceSoughtThisTrip: newValue}));
      setInputLength(newValue.length);
    }


  return (
    <PinkOutlinedTextField
      label="desired experience"
      value={whatToGetFromThisTrip}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
      size="small"
      inputRef={inputRef}
      disabled={inputLength >= maxLength}
      helperText={`In a few words, what do you want to get from this trip?`}
    />
  );
};

export default ExperienceSoughtThisTrip;
