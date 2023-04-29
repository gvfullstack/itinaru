// components/CurrencyInput.tsx

import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {perPersonAverageBudgetState} from '../atoms/atoms';
import { useRecoilState } from 'recoil'; 


interface CurrencyInputProps {
  currencySymbol?: string;
  label?: string;
  helperText?: string;
}

const UserInputCurrencyInputField: React.FC<CurrencyInputProps> = ({
  currencySymbol = '$',
  label = 'Amount',
  helperText = 'Enter the amount',
}) => {

    const [budget, setBudget] = useRecoilState(perPersonAverageBudgetState);

    const handleChange=(e: any) => {
        const inputValue = parseFloat(e.target.value);
        if (!isNaN(inputValue)) {
          setBudget(inputValue);
        } else {
          setBudget(0);
        }
      }

  return (
    <TextField
      type="number"
    //   inputProps={{ step: '0.01' }}
      label={label}
      helperText={helperText}
      value={budget}
      onChange={(e)=>handleChange(e)}
      sx={{
            '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
            borderColor: 'theme.palette.primary.main',
            },
            '&.Mui-focused fieldset': {
            borderColor: 'theme.palette.primary.main',
            },
            borderRadius: '30px',
            borderColor: 'pink',
        },
        '& .MuiOutlinedInput-input': {
            fontSize: '18px',
            fontWeight: '400',
            padding: '10px 10px 10px 20px',
        },
        }}

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