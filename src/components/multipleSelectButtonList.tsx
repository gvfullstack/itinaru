import React, { useState, useEffect, useCallback } from "react";
import styles from "./multipleSelectButton.module.css";
const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: any) => void;

type MultiSelectHandler = (key: string, value: any) => void;

interface Neighborhoods {
  neighborhood: string;
  coordinates: { lat: number, lng: number }[];
}

interface PageComponentProps {
  multipleSelectOptions?: string[];
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
  const multipleSelectOptions = props.multipleSelectOptions ? props.multipleSelectOptions : [];
  

  const selectedOptionsPassed: string[] | undefined = !props.selectedOptions ? [] : props.selectedOptions 
  
  const handleOptionSelect = useCallback((option: string) => {

    handleInputChange("shouldAutoFocus", false);
    
    handleMultiSelect(props.keyOfMultiSelectButton, option)
  },[handleInputChange, handleMultiSelect, props.keyOfMultiSelectButton])
   
  return (
    <div className={styles.multiSelectButtonContainer}>
      {multipleSelectOptions.map((option) => (
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