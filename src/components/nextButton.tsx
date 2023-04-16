import React from "react";
import axios from 'axios';
import { useRecoilState } from 'recoil';

import getConfig from 'next/config';
import style from './nextButton.module.css';
import { neighborhoodsState, selectedNeighborhoodsState, keyOfMultiSelectButtonState } from "../../src/pages"


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const { BASE_URL } = publicRuntimeConfig;

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[] |
  {neighborhood: string
   coordinates?: { lat: number, lng: number }[]}[]
) => void;

interface Neighborhoods {
  neighborhood: string;
  coordinates: { lat: number, lng: number }[];
}

interface Props {

  handleInputChange?: HandleInputChange; 
  nextButtonText?: string;
  nextPageStep?: string
  nextButtonStaticValue?: string | boolean | number | readonly string[]
  specificSitesBool?: boolean
  nextPageStepR2?: string
  destination?: string
  nextButtonGenerateAPI?: boolean;
  multipleSelectOptions?: string[] | Neighborhoods[];  
  keyOfMultiSelectButton?: string;
}

const NextButton: React.FC<Props> = (props) => {
  const [neighborhoods, setNeighborhoods] = useRecoilState(neighborhoodsState);

  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const nextButtonGenerateAPI = props.nextButtonGenerateAPI ? props.nextButtonGenerateAPI : false;
  

  const normalExecutionBlock = () => {
    if (props.nextButtonStaticValue === undefined) {
      handleInputChange("curStep", props.nextPageStep);
    } 
    else if(props.nextButtonStaticValue === true){
      handleInputChange("curStep", props.nextPageStep);
      handleInputChange("specificSitesBool", props.nextButtonStaticValue);
    } 
    else if(props.nextButtonStaticValue === false){
      handleInputChange("curStep", props.nextPageStepR2);
      handleInputChange("specificSitesBool", props.nextButtonStaticValue);
    } 
  }

  const updateNeighborhoods = (neighborhoods: any[]) => {
                                
     handleInputChange("multipleSelectObjects", neighborhoods);
     setNeighborhoods(neighborhoods)
  }
 

  const apiExecutionBlock = () => {
    handleInputChange("isLoading", true);
    const baseUrl = 'http://localhost:3000';
    axios.post(baseUrl +'/api/neighborhood/city', { city: "san fransisco" }) 
      .then((response) => { 
        setTimeout(()=> handleInputChange("isLoading",false), 100);
        normalExecutionBlock();
        updateNeighborhoods(response.data);

      })
  }

  const handleClick = () => {
    if (nextButtonGenerateAPI) {
      apiExecutionBlock();
    } else {
      normalExecutionBlock();
    }
  }

  return <div className={style.nextButtonContainer}>
    <button className={style.nextButton}onClick={handleClick} >{props.nextButtonText}</button>
    </div>
};

export default NextButton;