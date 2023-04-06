import * as React from 'react';
import { useState } from "react";
import PageComponent from "./PageComponent";
import UserInput from '@/components/userInput';
import { isBooleanObject } from 'util/types';

const { v4: uuidv4 } = require('uuid');

interface PageComponentProps {
  children: React.ReactNode;
}

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

type MultiSelectHandler = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

type DefinedProps = {
    curStep?: string;
    pageStep?: string;
    prevPageStep?: string;
    nextPageStep?: string;
    nextPageStepR2?: string
    introText?: string;
    infoText1?: string;
    infoText2?: string;
    prompt?: string;
    destination?: string; 
    createButtonText?: string;
    nextButtonText?: string; 
    nextButtonStaticValue?: string | boolean
    nextButton2Text?: string; 
    nextButton2StaticValue?: string | boolean
    backButtonText?: string;
    travelDate?: string;
    itinStartTime?: string;
    itinEndTime?: string;
    valOfStateVariable?: string | number | undefined;
    keyOfStateVariable?: string;
    valOfStateVariable2?: string | number | undefined;
    keyOfStateVariable2?: string;
    specificSitesBool?: boolean;
    specificSites?: string;
    itineraryItems?: string;
    excludedSites?: string;
    paceOptions?: string[];
    specificPace?: number | undefined;
    pace?: number | undefined;
    selectedPaceOption?: string;
    shouldAutoFocus?: boolean;
    travelerCount?: string;
    keyOfMultiSelectButton?: string;
    multipleSelectOptions?: string[];
    ageRangeSelection?: string[];
    handleMultiSelect?: MultiSelectHandler; 
    handleInputChange?: HandleInputChange;
    selectedOptions?: string[];  
    themeSelections?: string[]; 
    userDefinedThemes?: string;
    neighborhoodSelections?: string[];
    userDefinedNeighborhoods?: string;

  };
  
type StateVariables = {
  [key:string]: any;
  destination?: string;
  curStep?: string;
  travelDate?: string;
  itinStartTime?: string;
  itinEndTime?: string;
  specificSitesBool?: boolean;
  specificSites?: string;
  itineraryItems?: string;
  excludedSites?: string;
  specificPace?: number | undefined;
  pace?: number | undefined;
  selectedPaceOption?: string;
  shouldAutoFocus?: boolean;
  travelerCount?: string;
  ageRangeSelection?: string[]; 
  themeSelections?: string[];
  userDefinedThemes?: string;
  neighborhoodSelections?: string[];
  userDefinedNeighborhoods?: string;
}

const ItinBuilder3: React.FC<DefinedProps & PageComponentProps & 
                    StateVariables & HandleInputChange & MultiSelectHandler>  = (props) => {
  
  const [stateVariables, setStateVariables] = useState<StateVariables>({
    destination:"Pari",
    curStep:"80T",
    travelDate: "3/17/23",
    itinStartTime: "8am",
    itinEndTime: "6pm",
    specificSitesBool: false,
    specificSites:"",
    itineraryItems:"",
    excludedSites:"",
    specificPace: undefined,
    pace: undefined,
    selectedPaceOption: undefined, 
    shouldAutoFocus: false,
    travelerCount: undefined,
    ageRangeSelection: [],    
    themeSelections: [],
    userDefinedThemes: undefined,
    neighborhoodSelections: [],
    userDefinedNeighborhoods: undefined
  })

  const backButtonText = "Prev page please!"
  const createButtonText = "create itinerary now!";
  
  const handleInputChange:HandleInputChange = (key, value) => {
      setStateVariables((prevInputs) => ({ ...prevInputs, [key]: value }));
      console.log("state variable",{stateVariables})
  };

  const handleMultiSelect: MultiSelectHandler = (key, value) => {
    if(stateVariables[key].includes(value)){
      setStateVariables((prevInputs) => ({...prevInputs, 
        [key]:prevInputs[key].filter((selectedOption: any) => selectedOption !== value)
      }))    
    }
    else{
      setStateVariables((prevInputs) => ({...prevInputs, 
        [key]: [...prevInputs[key], value]
      }))
    }
    console.log(stateVariables)
  }

  const pageProps: DefinedProps[]   =
      [
        {
          curStep: stateVariables.curStep,
          pageStep: "10T",
          prevPageStep: "10T",
          nextPageStep: "20T",
          introText: "Welcome!",
          infoText1: "We're here to help you plan your next trip.",
          infoText2: "Let's put together a little itinerue for you!",
          prompt: "Where are you traveling to?",
          keyOfStateVariable: "destination",
          valOfStateVariable: stateVariables.destination,
          createButtonText: createButtonText,
          nextButtonText: "Lets customize!", 
          backButtonText: backButtonText, 
          shouldAutoFocus: stateVariables.shouldAutoFocus
        },
        {
          curStep: stateVariables.curStep,
          pageStep: "20T",
          prevPageStep: "10T",
          nextPageStep: "30T",
          introText: "OMG!",
          infoText1: `${stateVariables.destination} sounds fantastic!`,
          prompt: "What is your travel date?",
          keyOfStateVariable: "travelDate",
          valOfStateVariable: stateVariables.travelDate,
          createButtonText: createButtonText,
          nextButtonText: "Lets continue!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus
        },
          
        {   
          curStep: stateVariables.curStep,
          pageStep: "30T",
          prevPageStep: "20T",
          nextPageStep: "40T",
          introText: "Cool!",
          prompt: "What times do you see your day starting and ending?",
          keyOfStateVariable: "itinStartTime",
          valOfStateVariable: stateVariables.itinStartTime,
          keyOfStateVariable2: "itinEndTime",
          valOfStateVariable2: stateVariables.itinEndTime,
          createButtonText: createButtonText,
          nextButtonText: "time set! Next!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus 
        },
        {
          curStep: stateVariables.curStep,
          pageStep: "40T",
          prevPageStep: "30T",
          nextPageStep: "50T",
          nextPageStepR2: "60T",
          introText: "Perfect!",
          prompt: "Before I offer some suggestions, do you have any specific points of interest already in mind?",
          createButtonText: createButtonText,
          nextButtonText: "Oh, yeah!",
          nextButtonStaticValue: true,
          nextButton2Text: "Not yet!",
          nextButton2StaticValue: false,
          specificSitesBool: stateVariables.specificSitesBool,
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus 
        },
        {   
          curStep: stateVariables.curStep,
          pageStep: "50T",
          prevPageStep: "40T",
          nextPageStep: "60T",
          introText: "Super duper!",
          prompt: "What specific sites do you want to visit?",
          createButtonText: createButtonText,
          nextButtonText: "Onward!",
          itineraryItems: stateVariables.itineraryItems,
          keyOfStateVariable: "specificSites",
          valOfStateVariable: stateVariables.specificSites,
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus
        },
        {
          curStep: stateVariables.curStep,
          pageStep: "60T",
          prevPageStep: "50T",
          nextPageStep: "70T",
          introText: "Gotcha!",
          prompt: "Um, BTW, are there any specific sites you don’t want to visit during your trip?",
          excludedSites: stateVariables.excludedSites,
          createButtonText: createButtonText,
          nextButtonText: "Been there, done that. Let’s go!",
          keyOfStateVariable: "excludedSites",
          valOfStateVariable: stateVariables.excludedSites,
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus
        },
        {   
          curStep: stateVariables.curStep,
          pageStep: "70T",
          prevPageStep: "60T",
          nextPageStep: "80T",
          introText: "No worries, I got you!",
          infoText1: "Now I’ll ask a few questions about your preferences, so I can make appropriate recommendations.",
          prompt: "How quickly do you want to move through your itinerary/ how many sites do you want to see?",
          paceOptions: [
              "just want to chill! (1 site)",
              "take it easy! (2 sites)",
              "no need to rush! (3 sites)",
              "pep in my step! (4 sites)",
              "let’s keep it moving! (5 sites)",
              "pick up the pace! (6 sites)",
              "let’s hustle! (7 sites)",
              ],  //pace A is the user defined pace expressed as a number.
          keyOfStateVariable: "specificPace",
          valOfStateVariable: stateVariables.specificPace, 
          pace: stateVariables.pace,
          createButtonText: createButtonText,
          nextButtonText: "site count set!, Next!",
          backButtonText: backButtonText,
          selectedPaceOption: stateVariables.selectedPaceOption,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          },
          {   
            curStep: stateVariables.curStep,
            pageStep: "80T",
            prevPageStep: "70T",
            nextPageStep: "90T",
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            introText: "Okay!",
            infoText1: "Now, I’d like to incorporate some information about your group to tailor your itinerary to your needs.",
            prompt: "First, how many people are traveling on this trip?",
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "head count set! Next!",
            keyOfStateVariable: "travelerCount",
            valOfStateVariable: stateVariables.travelerCount
          },
          {   
            curStep: stateVariables.curStep,
            pageStep: "90T",
            prevPageStep: "80T",
            nextPageStep: "100T",
            // shouldAutoFocus: stateVariables.shouldAutoFocus,
            introText: "Beautiful!", 
            prompt: "What age ranges should be represented in this itinerary?",
            keyOfMultiSelectButton: "ageRangeSelection",
            multipleSelectOptions: 
                ["ages 0 - 3",
                "ages 4 - 8",
                "ages 9 - 17",
                "ages 18 - 64",
                "ages 65+"],
            ageRangeSelection: stateVariables.ageRangeSelection,
            backButtonText: backButtonText,
            createButtonText: createButtonText,
            nextButtonText: "age range set! Next!", 
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.ageRangeSelection
                },
          {
            curStep: stateVariables.curStep,
            pageStep: "100T",
            prevPageStep: "90T",
            nextPageStep: "110T",
            prompt: "Are there any additional themes or keywords you'd like me to consider for recommendations?",
            keyOfMultiSelectButton:"themeSelections",
            themeSelections: stateVariables.themeSelections,
            multipleSelectOptions: [
                "culture & history",
                "relaxation",
                "museums",
                "parks",
                "food and drink",
                "city exploration",
                "beaches",
                "adventure",
                "guided tours",
                "tourist attractions",
                "nature & wildlife",
                "night clubs",
                "live shows",
                "string"]
                , 
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "Done! Now, what?",
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.themeSelections,
            keyOfStateVariable: "userDefinedThemes",
            valOfStateVariable: stateVariables.userDefinedThemes,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            }, 
            {
            curStep: stateVariables.curStep,
            pageStep: "110T",
            prevPageStep: "100T",
            nextPageStep: "120T",
            introText: "Awesome, possom!",
            infoText1: `Here are popular neighborhoods to explore in ${stateVariables.destination}.`, 
            infoText2: "Feel free to select a few neighborhoods to explore.",
            prompt: "Selecting fewer usually means less commute between points of interest.",
            keyOfMultiSelectButton:"neighborhoodSelections",
            neighborhoodSelections: stateVariables.neighborhoodSelections,
            multipleSelectOptions: [
                "mission district",
                "north beach",
                "haight-ashbury",
                "castro district",
                "chinatown"]
                , 
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "to my suggestions",
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.neighborhoodSelections,
            keyOfStateVariable: "userDefinedNeighborhoods",
            valOfStateVariable: stateVariables.userDefinedNeighborhoods,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            },
            {   
              curStep: stateVariables.curStep,
              pageStep: "120T",
              prevPageStep: "110T",
              nextPageStep: "130T",
              introText: "Sweet!",
              infoText1: `Here are some attractions for ${stateVariables.destination} that take into account the information you’ve provided so far.`,
              prompt: "Please select any you would like me to add to your itinerary!",
              // nonMealItineraryItems: nonMealItineraryItems,
              // mealItineraryItems: mealItineraryItems,
              createButtonText: createButtonText,
              nextButtonText: "selections complete. Lets talk meals!",
              nextButton2Text: "show more attractions!"
              // itineraryItems: itineraryItems
          }
      ]

const handleCreateItinerary = () => {
  //for button that created itinerary at any stage
}


return (
  <div>
    {pageProps.map(props => (
      stateVariables.curStep === props.pageStep && (
        <PageComponent 
              key={uuidv4()} 
              {...props} 
              handleCreateItinerary={handleCreateItinerary}
              handleInputChange={handleInputChange}
              />)
          ))}
          {props.children}
  </div>
);
          }
export default ItinBuilder3;