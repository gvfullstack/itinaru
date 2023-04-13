import * as React from 'react';
import { useState, useCallback } from "react";
import PageComponent from "./PageComponent";
import IsLoadingPage from '@/components/isLoadingPage';
import styles from '../styles/ItinBuilder.module.css';

const { v4: uuidv4 } = require('uuid');

interface PageComponentProps {
  children?: React.ReactNode;
}

type HandleInputChange = (key: string, value: any) => void;

type MultiSelectHandler = (key: string, value: any) => void;

interface Neighborhoods {
  neighborhood: string;
  loc: { lat: number, lng: number }[];
}

interface itineraryObject {

}

type DefinedProps = {
    curStep?: string;
    pageStep?: string;
    prevPageStep?: string;
    nextPageStep?: string;
    nextPageStepR2?: string
    introText?: string;
    destinationText?: string;
    infoText1?: string;
    infoText2?: string;
    prompt?: string;
    destination?: string; 
    createButtonText?: string;
    nextButtonText?: string; 
    nextButtonStaticValue?: string | boolean //assign a static value for values that cannot be inferred from state variable being updated and helps distinguish what button selection means when more than one button exists in a page
    nextButton2Text?: string; 
    nextButton2StaticValue?: string | boolean //assign a static value for values that cannot be inferred from state variable being updated and helps distinguish what button selection means when more than one button exists in a page
    backButtonText?: string;
    travelDate?: string;
    itinStartTime?: string;
    itinEndTime?: string;
    valOfStateVariable?: any;
    keyOfStateVariable?: string;
    valOfStateVariable2?: any;
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
    multipleSelectOptions?: string[]   
    multipleSelectObjects?: string[] | Neighborhoods[];
    mapCoordinates?:  (string | { lat: number; lng: number;}[]) [];  
    ageRangeSelection?: string[];
    handleMultiSelect?: MultiSelectHandler; 
    handleInputChange?: HandleInputChange;
    selectedOptions?: string[];  
    themeSelections?: string[]; 
    userDefinedThemes?: string;
    selectedNeighborhoods?: string[];
    userDefinedNeighborhoods?: string;
    nextButtonGenerateAPI?: boolean;
    isLoading?: boolean;
    separatorText?: string;
    userInputPlaceholder?: string;
    userInputPlaceholder2?: string;
    showMap?: boolean;
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
  selectedNeighborhoods?: string[];
  userDefinedNeighborhoods?: string;
  nextButtonGenerateAPI?: boolean;
  isLoading?: boolean;
  multipleSelectObjects?: string[] | Neighborhoods[];
  
  }

const ItinBuilder: React.FC<PageComponentProps> = (props) => {
  
  const [stateVariables, setStateVariables] = useState<StateVariables>({
    destination:undefined,
    curStep:"100T",
    travelDate: undefined,
    itinStartTime: undefined,
    itinEndTime: undefined,
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
    selectedNeighborhoods: [],
    userDefinedNeighborhoods: undefined,
    nextButtonGenerateAPI: false,
    isLoading: false,
    multipleSelectObjects: [],
    
  })

  const backButtonText = "Prev page please!"
  const createButtonText = "create itinerary now!";
  
  const handleInputChange:HandleInputChange = useCallback((key, value) => {
      setStateVariables((prevInputs) => ({ ...prevInputs, [key]: value }));
      console.log("state variable",{stateVariables})
  }, []);

  const handleMultiSelect: MultiSelectHandler = useCallback((key, value) => {
    if(stateVariables[key].includes(value)){
      console.log("item found")
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
  }, [])

  const pageProps: DefinedProps[]   =
      [
        {
          curStep: stateVariables.curStep,
          pageStep: "10T",
          prevPageStep: "10T",
          nextPageStep: "20T",
          introText: "Hello fellow traveler!",
          infoText1: "Let's put the 'u' in itinaru by planning your perfect trip!",
          prompt: "Where are you traveling to?",
          keyOfStateVariable: "destination",
          valOfStateVariable: stateVariables.destination,
          createButtonText: createButtonText,
          nextButtonText: "Lets customize!", 
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a destination"        
        },
        {
          curStep: stateVariables.curStep,
          pageStep: "20T",
          prevPageStep: "10T",
          nextPageStep: "30T",
          introText: "OMG!",
          destinationText: `${stateVariables.destination}`,
          infoText1: `sounds fantastic!`,
          prompt: "What is your travel date?",
          keyOfStateVariable: "travelDate",
          valOfStateVariable: stateVariables.travelDate,
          createButtonText: createButtonText,
          nextButtonText: "Lets continue!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          destination: stateVariables.destination,
          separatorText: "OR",
          userInputPlaceholder: "Enter a travel date"
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
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a start time",
          userInputPlaceholder2: "Enter an end time"  
        },
        {
          curStep: stateVariables.curStep,
          pageStep: "40T",
          prevPageStep: "30T",
          nextPageStep: "50T",
          nextPageStepR2: "60T",
          introText: "Perfect!",
          prompt: "Do you have any specific points of interest already in mind?",
          createButtonText: createButtonText,
          nextButtonText: "Oh, yeah!",
          nextButtonStaticValue: true,
          nextButton2Text: "Not yet!",
          nextButton2StaticValue: false,
          specificSitesBool: stateVariables.specificSitesBool,
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR" 
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
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter sites"
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
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter sites"

        },
        {   
          curStep: stateVariables.curStep,
          pageStep: "70T",
          prevPageStep: "60T",
          nextPageStep: "80T",
          introText: "No worries, I got you!",
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
          separatorText: "OR",
          userInputPlaceholder: "Custom number of sites"

          },
          {   
            curStep: stateVariables.curStep,
            pageStep: "80T",
            prevPageStep: "70T",
            nextPageStep: "90T",
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            introText: "Okay!",
            prompt: "How many people are traveling on this trip?",
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "head count set! Next!",
            keyOfStateVariable: "travelerCount",
            valOfStateVariable: stateVariables.travelerCount,
            separatorText: "OR",
            userInputPlaceholder: "e.g. 2"

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
            selectedOptions: stateVariables.ageRangeSelection,
            separatorText: "OR"
                },
          {
            curStep: stateVariables.curStep,
            pageStep: "100T",
            prevPageStep: "90T",
            nextPageStep: "110T",
            prompt: "What theme(s) or keyword(s) describe the trip you want to take?",
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
                "live shows"]
                , 
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "Done! Now, what?",
            nextButtonGenerateAPI: true,
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.themeSelections,
            
            keyOfStateVariable: "userDefinedThemes",
            valOfStateVariable: stateVariables.userDefinedThemes,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            destination: stateVariables.destination,
            separatorText: "OR",
            userInputPlaceholder: "e.g. 'art' or 'taverns'"            
            }, 
            {
            curStep: stateVariables.curStep,
            pageStep: "110T",
            prevPageStep: "100T",
            nextPageStep: "120T",
            introText: `Here are popular neighborhoods to explore in ${stateVariables.destination}.`,
            infoText1: "Feel free to select a few neighborhoods to explore.", 
            
            prompt: "Selecting fewer usually means less commute between points of interest.",
            keyOfMultiSelectButton:"selectedNeighborhoods",
            multipleSelectOptions: stateVariables.multipleSelectObjects && stateVariables.multipleSelectObjects.length ? 
                       stateVariables.multipleSelectObjects.map((selection) => typeof selection === 'string' ? selection : selection.neighborhood) : [] ,
            
            mapCoordinates: stateVariables.multipleSelectObjects && stateVariables.multipleSelectObjects.length ? 
                     stateVariables.multipleSelectObjects.map((selection) => typeof selection === 'string' ? selection : selection.coordinates) : undefined,
            multipleSelectObjects: stateVariables.multipleSelectObjects,
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "to my suggestions",
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.selectedNeighborhoods,
            selectedNeighborhoods: stateVariables.selectedNeighborhoods,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            separatorText: "OR",
            showMap: true
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
              nextButton2Text: "show more attractions!",
              separatorText: "OR",
              backButtonText: backButtonText,
            showMap: true

              // itineraryItems: itineraryItems
          }
      ]

const handleCreateItinerary = () => {
  //for button that created itinerary at any stage
}

console.log("rerendered the main itinbuidler component")

return (
  <div className={styles.pageComponentContainer}>
    {pageProps.map(props => (
      stateVariables.curStep === props.pageStep && 
      !stateVariables.isLoading &&
      (
        <PageComponent 
              key={uuidv4()} 
              {...props} 
              handleCreateItinerary={handleCreateItinerary}
              handleInputChange={handleInputChange}
              />)
          ))}
    {stateVariables.isLoading && (<IsLoadingPage />)}
          {props.children}
  </div>
);
          }
export default ItinBuilder;