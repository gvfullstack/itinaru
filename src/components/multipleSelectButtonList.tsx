import React, { useState, useEffect, useCallback } from "react";
import styles from "./multipleSelectButton.module.css";
const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

type MultiSelectHandler = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

interface PageComponentProps {
  multipleSelectOptions: string[];
  keyOfMultiSelectButton: string;
  handleInputChange?: HandleInputChange; 
  handleMultiSelect?: MultiSelectHandler; 
  shouldAutoFocus?: boolean;
  selectedOptions?: string[];
  destination?: string;

}

const MultipleSelectButtonList: React.FC<PageComponentProps> = (props) => {
  
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const handleMultiSelect = props.handleMultiSelect ? props.handleMultiSelect : () => {};

  const selectedOptionsPassed: string[] | undefined = !props.selectedOptions ? [] : props.selectedOptions 
  const handleOptionSelect = (option: string) => {

    handleInputChange("shouldAutoFocus", false);
    
    handleMultiSelect(props.keyOfMultiSelectButton, option)
  }
   
  return (
    <div className={styles.multiSelectButtonContainer}>
      {props.multipleSelectOptions.map((option) => (
        <button
          key={uuidv4()}
          onClick={() => handleOptionSelect(option)}
          className= {`${styles.multiSelectButton} ${selectedOptionsPassed.includes(option) ? styles.selected : ""}`}
          >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleSelectButtonList;