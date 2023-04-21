import React from "react";
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { DefinedProps } from "@/typeDefs";
import getConfig from 'next/config';
import style from './itinBuilderCSS/nextButton.module.css';
import { neighborhoodsState, curStepState} from "../../src/atoms/atoms"


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const { BASE_URL } = publicRuntimeConfig;

const NextButton: React.FC<DefinedProps> = (props) => {
  const [neighborhoods, setNeighborhoods] = useRecoilState(neighborhoodsState);
  const [curStep, setCurStep] = useRecoilState(curStepState);
  
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const nextButtonGenerateAPI = props.nextButtonGenerateAPI ? props.nextButtonGenerateAPI : false;
  

  const normalExecutionBlock = () => {
    if(props.nextPageStep){
      if (props.nextButtonStaticValue === undefined) {
        setCurStep(props.nextPageStep);
      } 
      else if(props.nextButtonStaticValue === true){
        setCurStep(props.nextPageStep);
        handleInputChange("specificSitesBool", props.nextButtonStaticValue);
      } 
      else if(props.nextButtonStaticValue === false){
        if(props.nextPageStepR2){
          setCurStep(props.nextPageStepR2);}
          handleInputChange("specificSitesBool", props.nextButtonStaticValue);
      } 
  }}

  const updateNeighborhoods = (neighborhoods: any[]) => {
     const neighborhoodsWithSelectedFalse = neighborhoods.map((neighborhood: any) => {                                                       
        return {...neighborhood, selected: false, descHidden: true}
      })
    //  handleInputChange("multipleSelectObjects", neighborhoods);
     setNeighborhoods(neighborhoodsWithSelectedFalse)
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