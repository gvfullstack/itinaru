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
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);


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
          userInput1: destinationState,
          keyOfStateVariable: "destination",
          createButtonText: createButtonText,
          nextButtonText: "Lets customize!", 
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a destination",
          displayIntroText: true,        
        },
        {
          pageStep: "20T",
          prevPageStep: "10T",
          nextPageStep: "30T",
          displayDatePicker: true,
          createButtonText: createButtonText,
          nextButtonText: "Lets continue!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          destination: stateVariables.destination,
          separatorText: "OR",
          userInputPlaceholder: "Enter a travel date",
          displayIntroText: true,        
        },
          
        {   
          pageStep: "30T",
          prevPageStep: "20T",
          nextPageStep: "40T",
          displayTimePicker: true,
          createButtonText: createButtonText,
          nextButtonText: "time set! Next!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Enter a start time",
          userInputPlaceholder2: "Enter an end time",
          displayIntroText: true,          
        },
        {
          pageStep: "40T",
          prevPageStep: "30T",
          nextPageStep: "50T",
          createButtonText: createButtonText,
          displayBudgetInput: true,
          nextButtonText: "Budget Set, Next!",
          nextButtonStaticValue: true,
          specificSitesBool: stateVariables.specificSitesBool,
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          displayIntroText: true,         
        },
        {   
          pageStep: "50T",
          prevPageStep: "40T",
          nextPageStep: "60T",
          createButtonText: createButtonText,
          nextButtonText: "Onward!",
          itineraryItems: stateVariables.itineraryItems,
          userInput1: specificSitesState,
          keyOfStateVariable: "specificSites",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "optional: e.g. golden gate park, louvre, etc. ",
          displayIntroText: true,        
        },
        {
          pageStep: "60T",
          prevPageStep: "50T",
          nextPageStep: "70T",
          createButtonText: createButtonText,
          nextButtonText: "Let’s go!",
          userInput1: excludedSitesState,
          keyOfStateVariable: "excludedSites",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "optional: e.g. alcatraz, Pier 39, etc.",
          displayIntroText: true,        

        },
        {   
          pageStep: "70T",
          prevPageStep: "60T",
          nextPageStep: "80T",
          singleSelectOptions: paceOptionsState,
          keyOfStateVariable: "specificPace",
          userInput1: selectedPaceState,
          createButtonText: createButtonText,
          nextButtonText: "site count set!, Next!",
          backButtonText: backButtonText,
          shouldAutoFocus: stateVariables.shouldAutoFocus,
          separatorText: "OR",
          userInputPlaceholder: "Custom number of sites",
          displayIntroText: true,        

          },
          {   
            pageStep: "80T",
            prevPageStep: "70T",
            nextPageStep: "90T",
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            nextButtonText: "head count set! Next!",
            userInput1: travelerCountState,
            keyOfStateVariable: "travelerCount",
            separatorText: "OR",
            userInputPlaceholder: "e.g. 2",
            displayIntroText: true,        

          },
          {   
            pageStep: "90T",
            prevPageStep: "80T",
            nextPageStep: "100T",
            keyOfMultiSelectButton: "ageRangeSelection",
            multipleSelectOptions: ageRangeOptionsState, 
            ageRangeSelection: stateVariables.ageRangeSelection,
            backButtonText: backButtonText,
            createButtonText: createButtonText,
            nextButtonText: "age range set! Next!", 
            handleMultiSelect: handleMultiSelect,
            selectedOptions: stateVariables.ageRangeSelection,
            separatorText: "OR",
            displayIntroText: true,        
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
            userInputPlaceholder: "e.g. 'art' or 'taverns'",
            displayIntroText: true,        
            }, 
            {
            pageStep: "110T",
            prevPageStep: "100T",
            nextPageStep: "120T",
            createButtonText: createButtonText,
            backButtonText: backButtonText,
            handleMultiSelect: handleMultiSelect,
            shouldAutoFocus: stateVariables.shouldAutoFocus,
            separatorText: "OR",
            showNeighborhoods: true,
            displayIntroText: true,        
            },
            {   
            pageStep: "120T",
            prevPageStep: "110T",
            nextPageStep: "130T",
            backButtonText: "<<<",
            itineraryItemsState: itineraryItemsState,
            displayIntroText: false,        
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
  </div>
);
          }
export default ItinBuilder;