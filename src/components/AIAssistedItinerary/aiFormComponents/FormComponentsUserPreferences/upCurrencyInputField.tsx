// components/CurrencyInput.tsx

import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import {userPreferencesAtom} from '../../aiItinAtoms';
import { useRecoilState } from 'recoil'; 

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

interface CurrencyInputProps {
  currencySymbol?: string;
  label?: string;
  helperText?: string;
}

const UserInputCurrencyInputField: React.FC<CurrencyInputProps> = ({
  currencySymbol = '$',
  label = 'per user daily budget',
  helperText = 'Enter the amount',
}) => {

    const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
    const budget = userPreferences.dailyBudget?.Amount;
   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseFloat(inputValue);
      const newAmount = isNaN(numericValue) ? 0 : numericValue;
      const formattedValue = newAmount === 0 ? '' : newAmount.toString();
      setUserPreferences((prevUserPreferences) => ({
        ...prevUserPreferences,
        dailyBudget: { ...prevUserPreferences.dailyBudget, Amount: formattedValue },
      }));
    };    
    

  
  return (
    <PinkOutlinedTextField
      type="text"
      label={label}
      // helperText={helperText}
      value={budget}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{currencySymbol}</InputAdornment>
        ),
      }}
      variant="outlined"
      fullWidth
    />
  );
};

export default UserInputCurrencyInputField;