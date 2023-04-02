import React, { useState } from "react";
import WelcomeText from "../components/welcomeText";
import UserInput from "../components/serInput";
import TimeDropdown from "../components/timeDropdown";
import DateInput from "../components/dateInput";
import NextButton from "../components/nextButton";
import CreateItineraryButton from "../components/createItineraryButton";
import SelectButton from "../components/selectButton";
import { UserInputs, Meal, UserDefinedMeals, definedProps } from './ItinBuilder2';

type ItinBuilderProps = {
  userInputs: UserInputs;
  meals: Meal[];
  userDefinedMeals: UserDefinedMeals;
  definedProps: definedProps;
};

const PageComponent: React.FC<ItinBuilderProps> = ({
  userInputs,
  meals,
  userDefinedMeals,
  definedProps,
}) => {

  return (
    <>
    YES
      <WelcomeText />

      {/* <UserInput
        destination={destination}
        specificSites={specificSites}
        excludedSites={excludedSites}
        travelerCount={travelerCount}
        additionalThemes={additionalThemes}
        neighborhoods={neighborhoods}
        />
      
      <TimeDropdown 
        startTime={startTime} 
        endTime={endTime} />
      
      <DateInput travelDate={travelDate} />
      
      <NextButton onClick={handleNextStep} message="Next" />
      
      <CreateItineraryButton onClick={handleCreateItinerary} />
      
      <SelectButton
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelectButton}
        /> */}
      
    </>
      
  );
};


export default PageComponent;