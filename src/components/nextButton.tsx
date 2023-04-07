import React from "react";
import axios from 'axios';
import getConfig from 'next/config';


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const { BASE_URL } = publicRuntimeConfig;

interface Props {

  handleInputChange: (key: string, value: string | number | Date | undefined | boolean) => void; 
  nextButtonText?: string;
  nextPageStep?: string
  nextButtonStaticValue?: string | boolean | number | readonly string[]
  specificSitesBool?: boolean
  nextPageStepR2?: string
  destination?: string

}

const NextButton: React.FC<Props> = (props) => {
console.log("what", props.destination)
  const handleClick = () => {
    const baseUrl = 'localhost:3000';
    axios.post(baseUrl +'/api/neighborhoods/city', { city: "san fransisco" }) 
      .then((response) => { console.log(response); 
        
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
      })
  }

  return <button onClick={handleClick} >{props.nextButtonText}</button>;
};

export default NextButton;