import React from "react";
import { useRef, useEffect } from 'react';
import styles from "./userInput.module.css";

const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

interface PageComponentProps {
  keyOfStateVariable: string,
  valOfStateVariable?: string;
  travelDate?: string;
  itinStartTime?: string;
  itinEndTime?: string;
  handleInputChange?: HandleInputChange; 
  shouldAutoFocus?: boolean;
  userInputPlaceholder?: string;
}

const UserInput: React.FC<PageComponentProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  
  useEffect(() => {
    // console.log("useEffect", props.shouldAutoFocus)
    if (inputRef.current && props.shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, [props.shouldAutoFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.shouldAutoFocus) {
      handleInputChange("shouldAutoFocus", true);
    }    

    handleInputChange(props.keyOfStateVariable, event.target.value);

    if(props.keyOfStateVariable === "specificPace") {
      handleInputChange("pace", event.target.value)
      handleInputChange("selectedPaceOption", "userSpecifiedSelection");
    };
  };



  return (
    <div className={styles.userInputContainer}>
      <input
        className={styles.userInput}
        ref={inputRef} 
        type="text" 
        id={props.keyOfStateVariable} 
        value={props.valOfStateVariable} 
        onChange={handleChange}
        placeholder={props.userInputPlaceholder}
        />
    </div>
  );
};

export default UserInput;





