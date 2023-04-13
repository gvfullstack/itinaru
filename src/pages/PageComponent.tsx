import React, { useState } from "react";
import WelcomeText from "../components/welcomeText";
import UserInput from "../components/userInput";
import NextButton from "../components/nextButton";
import CreateItineraryButton from "../components/createItineraryButton";
import BackButton from "../components/backButton";
import SingleSelectButtonList from "@/components/singleSelectButtonList";
import MultipleSelectButtonList from "@/components/multipleSelectButtonList"
import SeparatorText from "@/components/separatorText";
import styles from "./PageComponent.module.css";
import MapComponent from "../components/mapComponent";

const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: any) => void;

type MultiSelectHandler = (key: string, value: any) => void;

interface Neighborhoods {
  neighborhood: string;
  loc: { lat: number, lng: number }[];
}

type ItinBuilderProps = {
  children?: React.ReactNode;
  curStep?: string;
  pageStep?: string;
  prevPageStep?: string;
  nextPageStep?: string;
  introText?: string;
  destinationText?: string;
  infoText1?: string;
  infoText2?: string;
  prompt?: string;
  nextButtonText?: string; 
  nextButtonStaticValue?: string | boolean
  nextButton2Text?: string; 
  nextButton2StaticValue?: string | boolean
  backButtonText?: string;
  createButtonText?: string;
  handleCreateItinerary?: () => void;
  handleInputChange?: HandleInputChange; 
  handleMultiSelect?: MultiSelectHandler; 
  keyOfStateVariable?:string
  valOfStateVariable?: string;
  keyOfStateVariable2?:string
  valOfStateVariable2?: string;
  step?: number;
  travelDate?: string;
  itinStartTime?: string;
  itinEndTime?: string;
  specificSitesBool?: boolean;
  nextPageStepR2?: string;
  specificPace?: number | undefined;
  pace?: number | undefined;
  paceOptions?: string[];
  excludedSites?: string;
  selectedPaceOption?: string;
  shouldAutoFocus?: boolean;
  travelerCount?: string;
  multipleSelectOptions?: string[] ;  
  multipleSelectObjects?: string[] | Neighborhoods[];
  mapCoordinates?:  (string | { lat: number; lng: number;}[]) [];  
  ageRangeSelection?: string[];  
  keyOfMultiSelectButton?: string; 
  selectedOptions?: string[];   
  themeSelections?: string[]; 
  userDefinedThemes?: string;
  destination?: string;
  nextButtonGenerateAPI?: boolean;
  isLoading?: boolean;
  separatorText?: string;
  userInputPlaceholder?: string;
  userInputPlaceholder2?: string;
  showMap?: boolean;
  selectedNeighborhoods?: string[];
};

const PageComponent: React.FC<ItinBuilderProps> = (props) => {
  console.log("PageComponent just REDENDERED")
  const input1StateVariables = ["destination", "travelDate", "itinStartTime", 
    "specificSites", "excludedSites", "specificPace", "travelerCount", "userDefinedThemes",
    "userDefinedNeighborhoods"]

  const input2StateVariables = ["itinEndTime"]

  return (
    <div className={styles.pageComponentContainer}>
      <WelcomeText 
          introText={props.introText}
          infoText1={props.infoText1}
          infoText2={props.infoText2}
          prompt={props.prompt}
          destinationText={props.destinationText}
      />


      {props.paceOptions && 
        <SingleSelectButtonList
          paceOptions={props.paceOptions}
          handleInputChange={props.handleInputChange}
          selectedPaceOption= {props.selectedPaceOption}
          shouldAutoFocus={props.shouldAutoFocus}
          />}
      
      {props.multipleSelectOptions && props.keyOfMultiSelectButton && 
        <MultipleSelectButtonList 
          multipleSelectOptions={props.multipleSelectOptions}
          keyOfMultiSelectButton={props.keyOfMultiSelectButton}
          handleInputChange={props.handleInputChange}
          handleMultiSelect={props.handleMultiSelect}
          selectedOptions={props.selectedOptions}
          destination={props.destination}
          />}
      
      {input1StateVariables.map((input1StateVariable) => 
        {
          return (
            props.keyOfStateVariable === input1StateVariable && (
            <UserInput
                key={uuidv4()}
                keyOfStateVariable={props.keyOfStateVariable}
                valOfStateVariable={props.valOfStateVariable}
                handleInputChange={props.handleInputChange}
                shouldAutoFocus={props.shouldAutoFocus}
                userInputPlaceholder={props.userInputPlaceholder}
            />)   
          )
        }
      )}

      {input2StateVariables.map((input2StateVariable) => 
        {
          return (
            props.keyOfStateVariable2 === input2StateVariable && (
            <UserInput
                key={uuidv4()}
                keyOfStateVariable={props.keyOfStateVariable2}
                valOfStateVariable={props.valOfStateVariable2}
                handleInputChange={props.handleInputChange}
                userInputPlaceholder={props.userInputPlaceholder2}
            />)   
          )
        }
      )}
          
    
      <NextButton 
          key={uuidv4()}
          handleInputChange={props.handleInputChange} 
          nextButtonText={props.nextButtonText} 
          nextButtonStaticValue={props.nextButtonStaticValue}
          nextPageStep={props.nextPageStep}
          specificSitesBool={props.specificSitesBool}
          nextPageStepR2={props.nextPageStepR2}
          destination={props.destination}
          nextButtonGenerateAPI= {props.nextButtonGenerateAPI}
          multipleSelectOptions = {props.multipleSelectOptions}
          keyOfMultiSelectButton = {props.keyOfMultiSelectButton}
          />

      {props.nextPageStepR2 && (<NextButton 
          key={uuidv4()}
          handleInputChange={props.handleInputChange} 
          nextButtonText={props.nextButton2Text} 
          nextButtonStaticValue={props.nextButton2StaticValue}
          nextPageStep={props.nextPageStep}
          specificSitesBool={props.specificSitesBool}
          nextPageStepR2={props.nextPageStepR2}
          />)}
      
      {props.backButtonText && (<BackButton
        key={uuidv4()}
        backButtonText={props.backButtonText}
        prevPageStep={props.prevPageStep}
        handleInputChange={props.handleInputChange} 
        />)}

      <SeparatorText 
          separatorText={props.separatorText}
      />

      <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleCreateItinerary={props.handleCreateItinerary} 
          />
          
        
      {props.showMap && 
      (<MapComponent 
          key={uuidv4()}
          multipleSelectObjects={props.multipleSelectObjects}
          selectedNeighborhoods={props.selectedNeighborhoods}
          handleMultiSelect={props.handleMultiSelect}
          keyOfMultiSelectButton={props.keyOfMultiSelectButton}
        />
          )}

   </div>

          
      );
};


export default React.memo(PageComponent);