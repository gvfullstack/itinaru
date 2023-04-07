import React from "react";
import { useRef, useEffect } from 'react';

// const PageComponent: React.FC<ItinBuilderProps> = (props) => 
const { v4: uuidv4 } = require('uuid');


interface PageComponentProps {
  keyOfStateVariable: string,
  valOfStateVariable?: string;
  travelDate?: string;
  itinStartTime?: string;
  itinEndTime?: string;
  handleInputChange: (key: string, value: string | number | Date | boolean) => void; 
  shouldAutoFocus?: boolean
}

const UserInput: React.FC<PageComponentProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    console.log("useEffect", props.shouldAutoFocus)
    if (inputRef.current && props.shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, [props.shouldAutoFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.shouldAutoFocus) {
      props.handleInputChange("shouldAutoFocus", true);
    }    

    props.handleInputChange(props.keyOfStateVariable, event.target.value);

    if(props.keyOfStateVariable === "specificPace") {
      props.handleInputChange("pace", event.target.value)
      props.handleInputChange("selectedPaceOption", "userSpecifiedSelection");
    };
  };



  return (
    <div>
      <input
        ref={inputRef} 
        type="text" 
        id={props.keyOfStateVariable} 
        value={props.valOfStateVariable} 
        onChange={handleChange}
        />
    </div>
  );
};

export default UserInput;





