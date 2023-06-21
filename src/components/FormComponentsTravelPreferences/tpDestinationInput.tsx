import React, { useState, useEffect } from 'react';
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
    fontSize: '1rem',
    fontWeight: '400',
    padding: '10px 10px 10px 20px',
  },
  width: "90%",
  maxWidth: '20rem',
}));

interface City {
  city: string;
}

function DestinationInput() {
  const [tripPreferences, setTripPreferencesAtom] = useRecoilState(tripPreferencesAtom);
  const selectedCity = cities.find(city => `${city.city}` === tripPreferences.destination) || null;
  const maxLength = 255;
  const debounceDelay = 3000; // Adjust the debounce delay as per your preference
  const suggestionsDelay = 3000; // Delay before showing suggestions in milliseconds

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Track whether to show suggestions

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuggestions(inputValue !== '' && suggestions.length > 0);
    }, suggestionsDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, suggestions, suggestionsDelay]);

  // Create a debounced version of the search function
  const debouncedSearch = debounce((value: string) => {
    // Perform the actual search operation here and update the suggestions state
    const filteredOptions = cities.filter((city) => {
      const cityName = city.city;
      if (typeof cityName === 'string') {
        return cityName.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });
    setSuggestions(filteredOptions);
  }, debounceDelay);

  const handleChange = (event: React.ChangeEvent<{}>, value: { city: string } | null) => {
    const destination = value ? value.city : '';
    setInputValue(destination);
    setTripPreferencesAtom((prevTripPreferenceState) => ({
      ...prevTripPreferenceState,
      destination: destination
    }));
  };

  const handleInputChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
    const inputValue = value || '';
    setInputValue(inputValue);
    debouncedSearch(inputValue);
  };

  const handleInputBlur = () => {
    if (inputValue === '') {
      setInputValue('');
      setSuggestions([]);
    }
  };

  const filterOptions = () => {
    return suggestions;
  };

  
  return (
    <Box display="flex" justifyContent="center">
      <Autocomplete
        options={filterOptions()}
        getOptionLabel={(option) => option.city}
        style={{ width: 500 }}
        value={selectedCity}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onBlur={handleInputBlur}
        renderInput={(params) =>
          <PinkOutlinedTextField
            {...params}
            label="Enter your destination"
            variant="outlined"
            size="small"
            disabled={!!tripPreferences.destination && tripPreferences.destination.length >= maxLength}
          />
        }
        loading={!showSuggestions} // Show loading indicator when suggestions are being fetched
        loadingText="Loading..."
        noOptionsText="No matching cities"
      />
    </Box>
  );
}

// Debounce function implementation
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  } as T;
}

export default DestinationInput;
