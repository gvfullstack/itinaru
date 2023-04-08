import React, { useState } from "react";
import styles from "./singleSelectButton.module.css";

const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

interface PageComponentProps {
  paceOptions: string[];
  handleInputChange?: HandleInputChange; 
  selectedPaceOption?: string
  shouldAutoFocus?: boolean
}

const singleSelectButtonList: React.FC<PageComponentProps> = (props) => {
  
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};

  const handleOptionSelect = (option: string, index: number) => {

    const extractedPaceNumber = index + 1
    if (props.shouldAutoFocus) {
      handleInputChange("shouldAutoFocus", false);
    }

    if (props.selectedPaceOption === option) {
      handleInputChange("pace", undefined);
      handleInputChange("selectedPaceOption", undefined);
    } else {
      handleInputChange("pace", extractedPaceNumber);
      handleInputChange("selectedPaceOption", option);
      handleInputChange("specificPace", extractedPaceNumber);

    }
   

  };

  return (
    <div className={styles.singleSelectButtonContainer}>
      {props.paceOptions.map((option, index) => (

        <button
        key={uuidv4()}
        onClick={() => handleOptionSelect(option, index)}
        className={`${styles.singleSelectButton} ${props.selectedPaceOption === option ? styles.selected : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default singleSelectButtonList;