import React, { useState, useEffect, useCallback } from "react";
const { v4: uuidv4 } = require('uuid');

interface PageComponentProps {
  multipleSelectOptions: string[];
  keyOfMultiSelectButton: string;
  handleInputChange: (key: string, value: string | number | Date | undefined | boolean | string[]) => void; 
  handleMultiSelect: (key: string, value: string | number | Date | undefined | boolean | string[]) => void; 
  shouldAutoFocus?: boolean;
  selectedOptions?: string[];
}

const MultipleSelectButtonList: React.FC<PageComponentProps> = (props) => {
  
  const selectedOptionsPassed: string[] | undefined = !props.selectedOptions ? [] : props.selectedOptions 
  const handleOptionSelect = (option: string) => {

    props.handleInputChange("shouldAutoFocus", false);
    
    props.handleMultiSelect(props.keyOfMultiSelectButton, option)
  }
   
  return (
    <div>
      {props.multipleSelectOptions.map((option) => (
        <button
          key={uuidv4()}
          onClick={() => handleOptionSelect(option)}
          className= {selectedOptionsPassed.includes(option) ? "selected" : ""}
          >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleSelectButtonList;