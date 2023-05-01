import React, { useState } from "react";
import WelcomeText from "../welcomeText";
import UserInput from "../userInput";
import NextButton from "../nextButton";
import CreateItineraryButton from "../createItineraryButton";
import BackButton from "../backButton";
import SingleSelectButtonList from "@/components/singleSelectButtonList";
import MultipleSelectButtonList from "@/components/multipleSelectButtonList"
import SeparatorText from "@/components/separatorText";
import styles from "../itinBuilderCSS/itinForm.module.css";
import MultipleSelectNeighborhoodButtons from "@/components/multipleSelectNeighborhoodButtons";
import { DefinedProps } from "../../../src/typeDefs" 
import Itinerary from "../itinerary";

const { v4: uuidv4 } = require('uuid');



const InitForm: React.FC<DefinedProps> = (props) => {
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
          pageStep={props.pageStep}
      />

      {props.singleSelectOptions && 
        <SingleSelectButtonList
          singleSelectOptions = {props.singleSelectOptions}
          keyOfStateVariable = {props.keyOfStateVariable}
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

      {props.showNeighborhoods && <MultipleSelectNeighborhoodButtons />}
      
      {input1StateVariables.map((input1StateVariable) => 
        {
          return (
            props.keyOfStateVariable === input1StateVariable && (
            <UserInput
                key={uuidv4()}
                userInput={props.userInput1}
                userInputPlaceholder={props.userInputPlaceholder}
                keyOfStateVariable={props.keyOfStateVariable}
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
                userInput={props.userInput2}
                keyOfStateVariable={props.keyOfStateVariable}
                userInputPlaceholder={props.userInputPlaceholder2}
            />)   
          )
        }
      )}
          
    
      {props.nextButtonText && <NextButton 
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
          />}

      {props.nextPageStepR2 && (<NextButton 
          key={uuidv4()}
          handleInputChange={props.handleInputChange} 
          nextButtonText={props.nextButton2Text} 
          nextButtonStaticValue={props.nextButton2StaticValue}
          nextPageStep={props.nextPageStep}
          specificSitesBool={props.specificSitesBool}
          nextPageStepR2={props.nextPageStepR2}
          />)}

      {props.itineraryItemsState && 
      props.pageStep === "120T" &&
      <Itinerary />}
      
      {props.backButtonText && (<BackButton
        key={uuidv4()}
        backButtonText={props.backButtonText}
        prevPageStep={props.prevPageStep}
        handleInputChange={props.handleInputChange} 
        />)}

      <SeparatorText 
          separatorText={props.separatorText}
      />

      {props.createButtonText &&
       <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleInputChange={props.handleInputChange} 
          />}
          

   </div>

          
      );
};


export default React.memo(InitForm);