import React, { useState } from "react";
import WelcomeText from "../components/welcomeText";
import UserInput from "../components/userInput";
import TimeDropdown from "../components/timeDropdown";
import DateInput from "../components/dateInput";
import NextButton from "../components/nextButton";
import CreateItineraryButton from "../components/createItineraryButton";
import BackButton from "../components/backButton";
import SingleSelectButtonList from "@/components/singleSelectButtonList";
import MultipleSelectButtonList from "@/components/multipleSelectButtonList"


const { v4: uuidv4 } = require('uuid');

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

type MultiSelectHandler = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

type ItinBuilderProps = {
  curStep?: string;
  pageStep?: string;
  prevPageStep?: string;
  nextPageStep?: string;
  introText?: string;
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
  handleInputChange?: (key: string, value: string | number | Date | undefined | boolean | string[]) => void; 
  handleMultiSelect?: (key: string, value: string | number | Date | undefined | boolean | string[]) => void; 
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
  multipleSelectOptions?: string[];
  ageRangeSelection?: string[];  
  keyOfMultiSelectButton?: string; 
  selectedOptions?: string[];   
  themeSelections?: string[]; 
  userDefinedThemes?: string;
  destination?: string;
};

const PageComponent: React.FC<ItinBuilderProps> = (props) => {
  
  const input1StateVariables = ["destination", "travelDate", "itinStartTime", 
    "specificSites", "excludedSites", "specificPace", "travelerCount", "userDefinedThemes",
    "userDefinedNeighborhoods"]

  const input2StateVariables = ["itinEndTime"]

  return (
    <>
      <WelcomeText 
          introText={props.introText}
          infoText1={props.infoText1}
          infoText2={props.infoText2}
          prompt={props.prompt}
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
          />
      <NextButton 
          key={uuidv4()}
          handleInputChange={props.handleInputChange} 
          nextButtonText={props.nextButton2Text} 
          nextButtonStaticValue={props.nextButton2StaticValue}
          nextPageStep={props.nextPageStep}
          specificSitesBool={props.specificSitesBool}
          nextPageStepR2={props.nextPageStepR2}
          />
      
      <BackButton
        key={uuidv4()}
        backButtonText={props.backButtonText}
        prevPageStep={props.prevPageStep}
        handleInputChange={props.handleInputChange} 
        />

      <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleCreateItinerary={props.handleCreateItinerary} 
          />
          
        
        </>
          
      );
};


export default PageComponent;