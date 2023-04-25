import * as React from 'react';
import { useState, useCallback, useEffect } from "react";
import {
  useRecoilState, RecoilState
} from 'recoil';
import InitForm from "./itinForm";
import IsLoadingPage from '@/components/isLoadingPage';
import styles from '../../styles/ItinBuilder.module.css';
import { neighborhoodsState, curStepState, itinStartTimeState, 
  itinEndTimeState, destinationState, travelDateState, specificSitesState, 
  selectedPaceState, excludedSitesState, paceOptionsState, travelerCountState,
  userDefinedThemesState, itineraryItemsState,themeOptionsState,ageRangeOptionsState
} from "../../../src/atoms/atoms"
const { v4: uuidv4 } = require('uuid');
import { Neighborhoods, HandleInputChange, MultiSelectHandler, DefinedProps } from "../../../src/typeDefs" 


type StateVariables = {
  [key:string]: any;
  specificSitesBool?: boolean;
  nextButtonGenerateAPI?: boolean;
  isLoading?: boolean;
  multipleSelectObjects?: string[] | Neighborhoods[];

  }

const ItinBuilder = (props: any) => {
  const [curStep, setCurStepState] = useRecoilState(curStepState);
  const [itineraryItems, setitineraryItems] = useRecoilState(itineraryItemsState);

  const [stateVariables, setStateVariables] = useState<StateVariables>({
    specificSitesBool: false,
    nextButtonGenerateAPI: false,
    isLoading: false,
    multipleSelectObjects: [],
    
  })

  const backButtonText = "Prev page please!"
  const createButtonText = "create itinerary now!";
  

  const handleInputChange:HandleInputChange = useCallback((key, value) => {
      setStateVariables((prevInputs) => ({ ...prevInputs, [key]: value }));
      console.log("state variable",{stateVariables})
  }, [stateVariables]);


  const handleMultiSelect: MultiSelectHandler = useCallback((key, value) => {
     if(stateVariables[key].includes(value)){
      // console.log("item found")
      setStateVariables((prevInputs) => ({...prevInputs, 
        [key]:prevInputs[key].filter((selectedOption: any) => selectedOption !== value)
      }))   
    }
    
    else{
      setStateVariables((prevInputs) => ({...prevInputs, 
        [key]: [...prevInputs[key], value]
      }))
    }
    
    
    // console.log(stateVariables)
  }, [stateVariables])

  const pageProps: (DefinedProps[] )   =
      [
        {
          pageStep: "10T",
          prevPageStep: "10T",
          nextPageStep: "20T",
          introText: "Hello fellow traveler!",
          infoText1: "Let's put the 'u' in itinaru by planning your perfect trip!",
          prompt: "Where are you traveling to?",
          userInput1: destinationState,
          keyOfStateVariable: "destination",
          createButtonText: createButtonText,
          nextButtonText: "Lets customize!", 
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a destination"        
        },
        {
          pageStep: "20T",
          prevPageStep: "10T",
          nextPageStep: "30T",
          introText: "OMG!",
          infoText1: `sounds fantastic!`,
          prompt: "What is your travel date?",
          userInput1: travelDateState,
          keyOfStateVariable: "travelDate",
          createButtonText: createButtonText,
          nextButtonText: "Lets continue!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          destination: stateVariables.destination,
          separatorText: "OR",
          userInputPlaceholder: "Enter a travel date"
        },
          
        {   
          pageStep: "30T",
          prevPageStep: "20T",
          nextPageStep: "40T",
          introText: "Cool!",
          prompt: "What times do you see your day starting and ending?",
          userInput1: itinStartTimeState,
          userInput2: itinEndTimeState,
          keyOfStateVariable: "itinStartTime",
          keyOfStateVariable2: "itinEndTime",
          createButtonText: createButtonText,
          nextButtonText: "time set! Next!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a start time",
          userInputPlaceholder2: "Enter an end time"  
        },
        {
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
          pageStep: "50T",
          prevPageStep: "40T",
          nextPageStep: "60T",
          introText: "Super duper!",
          prompt: "What specific sites do you want to visit?",
          createButtonText: createButtonText,
          nextButtonText: "Onward!",
          itineraryItems: stateVariables.itineraryItems,
          userInput1: specificSitesState,
          keyOfStateVariable: "specificSites",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter sites"
        },
        {
          pageStep: "60T",
          prevPageStep: "40T",
          nextPageStep: "70T",
          introText: "Gotcha!",
          prompt: "Um, BTW, are there any specific sites you don’t want to visit during your trip?",
          createButtonText: createButtonText,
          nextButtonText: "Been there, done that. Let’s go!",
          userInput1: excludedSitesState,
          keyOfStateVariable: "excludedSites",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter sites"

        },
        {   
          pageStep: "70T",
          prevPageStep: "60T",
          nextPageStep: "80T",
          introText: "No worries, I got you!",
          prompt: "How quickly do you want to move through your itinerary/ how many sites do you want to see?",
          singleSelectOptions: paceOptionsState,
          keyOfStateVariable: "specificPace",
          userInput1: selectedPaceState,
          createButtonText: createButtonText,
          nextButtonText: "site count set!, Next!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Custom number of sites"

          },
          {   
            pageStep: "80T",
            prevPageStep: "70T",
            nextPageStep: "90T",
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            introText: "Okay!",
            prompt: "How many people are traveling on this trip?",
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "head count set! Next!",
            userInput1: travelerCountState,
            keyOfStateVariable: "travelerCount",
            separatorText: "OR",
            userInputPlaceholder: "e.g. 2"

          },
          {   
            pageStep: "90T",
            prevPageStep: "80T",
            nextPageStep: "100T",
            introText: "Beautiful!", 
            prompt: "What age ranges should be represented in this itinerary?",
            keyOfMultiSelectButton: "ageRangeSelection",
            multipleSelectOptions: ageRangeOptionsState, 
            ageRangeSelection: stateVariables.ageRangeSelection,
            backButtonText: backButtonText,
            createButtonText: createButtonText,
            nextButtonText: "age range set! Next!", 
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.ageRangeSelection,
            separatorText: "OR"
                },
          {
            pageStep: "100T",
            prevPageStep: "90T",
            nextPageStep: "110T",
            prompt: "What theme(s) or keyword(s) describe the trip you want to take?",
            keyOfMultiSelectButton:"themeSelections",
            themeSelections: stateVariables.themeSelections,
            multipleSelectOptions: themeOptionsState,
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "Done! Now, what?",
            nextButtonGenerateAPI: true,
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.themeSelections,    
            userInput1: userDefinedThemesState,            
            keyOfStateVariable: "userDefinedThemes",
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            destination: stateVariables.destination,
            separatorText: "OR",
            userInputPlaceholder: "e.g. 'art' or 'taverns'"
            }, 
            {
            pageStep: "110T",
            prevPageStep: "100T",
            nextPageStep: "120T",
            introText: `Here are popular neighborhoods to explore in ${stateVariables.destination}.`,
            infoText1: "Feel free to select a few neighborhoods to explore.", 
            prompt: "Selecting fewer usually means less commute between points of interest.",
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            // nextButtonText: "to my suggestions",
            handleMultiSelect: handleMultiSelect,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            separatorText: "OR",
            showNeighborhoods: true,
            },
            {   
            pageStep: "120T",
            prevPageStep: "110T",
            nextPageStep: "130T",
            backButtonText: "<<<",
            itineraryItemsState: itineraryItemsState
          }
      ]

const handleCreateItinerary = () => {
  //for button that created itinerary at any stage
}

useEffect(() => {
  // console.log("rerendered the main itinbuidler component")

});


return (
  <div className={styles.pageComponentContainer}>
    {pageProps.map(props => (
      curStep === props.pageStep && 
      !stateVariables.isLoading &&
      (
        <InitForm 
              key={uuidv4()} 
              {...props} 
              // handleCreateItinerary={handleCreateItinerary}
              handleInputChange={handleInputChange}
              />)
          ))}
    {stateVariables.isLoading && (<IsLoadingPage />)}
          {props.children}
          <button onClick={()=>console.log(itineraryItems)}>log state</button>
  </div>
);
          }
export default ItinBuilder;