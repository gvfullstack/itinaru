import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import styles from "./itinBuilderCSS/userInput.module.css";
import {TextField} from "@mui/material";
import { styled } from '@mui/material/styles';
import { DefinedProps, HandleInputChange } from "@/typeDefs";  
import { useRecoilState } from "recoil";
import { defaultAtom, paceOptionsState} from "@/atoms/atoms";

const UserInput: React.FC<DefinedProps> = (props) => {
    const [value, setValue] = useRecoilState(props.userInput ? props.userInput : defaultAtom);
    const [paceOptions, setPaceOptions] = useRecoilState(paceOptionsState);
    const [inputLength, setInputLength] = useState(0);
    const maxLength = 255;

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      setInputLength(newValue.length);
  
      if(props.keyOfStateVariable==="specificPace") {
        const newValue = paceOptions.map((item) => ({
          ...item,
          selected: false,
        }));
        setPaceOptions(newValue);
      }
    };

   useEffect(() => {console.log("value: ", value)}, [value]);

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
  }));

  useEffect(() => {
    if (inputRef.current && props.shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, [props.shouldAutoFocus]);
  
  return (
    <PinkOutlinedTextField 
      label={props.userInputPlaceholder}
      value={value}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
      size="small"
      inputRef={inputRef}
      disabled={inputLength >= maxLength}
    />
  );
};

export default UserInput;
