import React, { useState } from "react";
const { v4: uuidv4 } = require('uuid');

interface PageComponentProps {
  paceOptions: string[];
  handleInputChange: (key: string, value: string | number | Date | undefined | boolean) => void; 
  selectedPaceOption?: string
  shouldAutoFocus?: boolean
}

const singleSelectButtonList: React.FC<PageComponentProps> = (props) => {
  

  const handleOptionSelect = (option: string, index: number) => {

    const extractedPaceNumber = index + 1
    if (props.shouldAutoFocus) {
      props.handleInputChange("shouldAutoFocus", false);
    }

    if (props.selectedPaceOption === option) {
      props.handleInputChange("pace", undefined);
      props.handleInputChange("selectedPaceOption", undefined);
    } else {
      props.handleInputChange("pace", extractedPaceNumber);
      props.handleInputChange("selectedPaceOption", option);
      props.handleInputChange("specificPace", undefined);
    }
   

  };

  return (
    <div>
      {props.paceOptions.map((option, index) => (

        <button
        key={uuidv4()}
        onClick={() => handleOptionSelect(option, index)}
        className={props.selectedPaceOption === option ? "selected" : ""}
         >
          {option}
        </button>
      ))}
    </div>
  );
};

export default singleSelectButtonList;