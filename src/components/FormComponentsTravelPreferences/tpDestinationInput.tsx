import React, { useState } from 'react';
import { TextField, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import { useRecoilState } from "recoil";
import { tripPreferencesAtom } from "@/atoms/atoms";
import cities from './cities.json';

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
}));

function DestinationInput() {
  const [tripPreferences, setTripPreferencesAtom] = useRecoilState(tripPreferencesAtom);
  const selectedCity = cities.find(city => `${city.city}, ${city.state}` === tripPreferences.destination) || null;
  const maxLength = 255;

  const handleChange = (_: any, newValue: { city: string; state: string } | null) => {
    setTripPreferencesAtom((prevTripPreferenceState)=> ({...prevTripPreferenceState, destination: newValue ? `${newValue.city}, ${newValue.state}` : ''}));
  }

  return (
    <Box display="flex" justifyContent="center">
      <Autocomplete
        options={cities}
        getOptionLabel={(option) => `${option.city}, ${option.state}`}
        style={{ width: 500 }}
        value={selectedCity}
        onChange={handleChange}
        renderInput={(params) => 
          <PinkOutlinedTextField
            {...params}
            label="Enter your destination"
            variant="outlined"
            size="small"
            disabled={!!tripPreferences.destination && tripPreferences.destination.length >= maxLength}
            />
        }
      />
    </Box>
  );
};

export default DestinationInput;
