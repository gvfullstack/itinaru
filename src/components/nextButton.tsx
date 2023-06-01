import React from "react";
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { DefinedProps } from "@/components/typeDefs";
import getConfig from 'next/config';
import style from './itinBuilderCSS/nextButton.module.css';
import { neighborhoodsState, curStepState, destinationState,
   userDefinedThemesState, themeOptionsState, ageRangeOptionsState, tripPreferencesAtom} from "../../src/atoms/atoms"


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const { BASE_URL } = publicRuntimeConfig;

const NextButton: React.FC<DefinedProps> = (props) => {
  const [neighborhoods, setNeighborhoods] = useRecoilState(neighborhoodsState);
  const [userDefinedThemes, setUserDefinedThemes] = useRecoilState(userDefinedThemesState);
  const [themeOptions, setThemeOptions] = useRecoilState(themeOptionsState);
  const [ageRangeOptions, setAgeRangeOptions] = useRecoilState(ageRangeOptionsState);
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const destination = tripPreferences.destination;
  

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
     setNeighborhoods(neighborhoodsWithSelectedFalse)
     console.log("neighborhoods", neighborhoods)
  }
 

  const apiExecutionBlock = () => {
    handleInputChange("isLoading", true);
    const baseUrl = BASE_URL;
    const selectedThemeOptions = themeOptions.filter((theme: { label: string, selected: boolean}) => theme.selected === true).map((theme)=>theme.label).join(',');
    const inScopeThemes = selectedThemeOptions + ',' + userDefinedThemes;
    const inScopeAgeRange = ageRangeOptions.filter((ageRange: { label: string, selected: boolean}) => ageRange.selected === true).map((ageRange)=>ageRange.label).join(',');

   
    axios.post(baseUrl +'/api/neighborhood/destination', 
    {destination: destination, 
      inScopeThemes: inScopeThemes, 
      inScopeAgeRange: inScopeAgeRange}) 

      .then((response) => { 
        normalExecutionBlock();
        console.log("success", response.data.neighborhoods);
        updateNeighborhoods(response.data.neighborhoods);
        
      }).catch((error) => {
        console.log("error", error);
      }).finally(() => {
        handleInputChange("isLoading", false);
      })
  }

  const handleClick = () => {
    if (nextButtonGenerateAPI) {
      apiExecutionBlock();
    } else {
      normalExecutionBlock();
    }
  }
  let disabled = !destination ? true : false;

  return <div className={style.nextButtonContainer}>
    <button className={`${style.nextButton} ${disabled? style.disabled:""}`} onClick={handleClick} disabled={disabled}>next</button>
    </div>
};

export default NextButton;