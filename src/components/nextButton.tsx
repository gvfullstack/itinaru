import React from "react";

interface Props {

  handleInputChange: (key: string, value: string | number | Date | undefined | boolean) => void; 
  nextButtonText?: string;
  nextPageStep?: string
  nextButtonStaticValue?: string | boolean | number | readonly string[]
  specificSitesBool?: boolean
  nextPageStepR2?: string
}

const NextButton: React.FC<Props> = (props) => {

  const handleClick = () => {
    if (props.nextButtonStaticValue === undefined) {
      props.handleInputChange("curStep", props.nextPageStep);
    } 
    else if(props.nextButtonStaticValue === true){
      props.handleInputChange("curStep", props.nextPageStep);
      props.handleInputChange("specificSitesBool", props.nextButtonStaticValue);
    } 
    else if(props.nextButtonStaticValue === false){
      props.handleInputChange("curStep", props.nextPageStepR2);
      props.handleInputChange("specificSitesBool", props.nextButtonStaticValue);
    } 
  }

  return <button onClick={handleClick} >{props.nextButtonText}</button>;
};

export default NextButton;