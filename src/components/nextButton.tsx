import React from "react";
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { DefinedProps } from "@/typeDefs";
import getConfig from 'next/config';
import style from './itinBuilderCSS/nextButton.module.css';
import { neighborhoodsState, curStepState, destinationState,
   userDefinedThemesState, themeOptionsState, ageRangeOptionsState} from "../../src/atoms/atoms"


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const { BASE_URL } = publicRuntimeConfig;

const NextButton: React.FC<DefinedProps> = (props) => {
  const [neighborhoods, setNeighborhoods] = useRecoilState(neighborhoodsState);
  const [userDefinedThemes, setUserDefinedThemes] = useRecoilState(userDefinedThemesState);
  const [themeOptions, setThemeOptions] = useRecoilState(themeOptionsState);
  const [ageRangeOptions, setAgeRangeOptions] = useRecoilState(ageRangeOptionsState);
  const [destination, setDestinationOptions] = useRecoilState(destinationState);
  

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
     console.log("neighborhoods", neighborhoods)
  }
 

  const apiExecutionBlock = () => {
    console.log(neighborhoods, curStep, destination, userDefinedThemes, themeOptions, ageRangeOptions)
    handleInputChange("isLoading", true);
    const baseUrl = 'http://localhost:3000';
    const selectedThemeOptions = themeOptions.filter((theme: { label: string, selected: boolean}) => theme.selected === true).map((theme)=>theme.label).join(',');
    const inScopeThemes = selectedThemeOptions + ',' + userDefinedThemes;
    const inScopeAgeRange = ageRangeOptions.filter((ageRange: { label: string, selected: boolean}) => ageRange.selected === true).map((ageRange)=>ageRange.label).join(',');

    console.log("destination", destination, 
    "inScopeThemes", inScopeThemes, 
    "inScopeAgeRange", inScopeAgeRange);
   
    axios.post(baseUrl +'/api/neighborhood/destination', 
    {destination: destination, 
      inScopeThemes: inScopeThemes, 
      inScopeAgeRange: inScopeAgeRange}) 

      .then((response) => { 
        setTimeout(()=> handleInputChange("isLoading",false));
        normalExecutionBlock();
        console.log("success", response.data.neighborhoods);
        updateNeighborhoods(response.data.neighborhoods);
        
      }).catch((error) => {
        console.log("error", error);
      });
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