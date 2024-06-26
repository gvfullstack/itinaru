import * as React from 'react';
import { useState, useCallback, useEffect } from "react";
import {
  useRecoilState, RecoilState
} from 'recoil';
import AIInitForm from "./aiItinForm";
import IsLoadingPage from './aiFormComponents/isLoadingPage';
import styles from '../../styles/ItinBuilder.module.css';
import { curStepState, itineraryItemsState
} from "./aiItinAtoms"
const { v4: uuidv4 } = require('uuid');
import { HandleInputChange, DefinedProps } from "./aiItinTypeDefs" 


type StateVariables = {
  [key:string]: any;
  isLoading?: boolean;
  }

const AIItinContainer = (props: any) => {
  const [curStep, setCurStepState] = useRecoilState(curStepState);


  const [stateVariables, setStateVariables] = useState<StateVariables>({
    isLoading: false,    
  })

  const createButtonText = "create itinerary now!";
  

  const handleInputChange:HandleInputChange = useCallback((key, value) => {
      setStateVariables((prevInputs) => ({ ...prevInputs, [key]: value }));
  }, [stateVariables]);


  const pageProps: (DefinedProps[] )   =
      [
        {
          pageStep: "10T",
          prevPageStep: "10T",
          nextPageStep: "20T",
          createButtonText: createButtonText,
          getNeigborhoodButtonText:"generate neighborhood suggestions",
          displayDestinationInput: true,
          displayIntroText: true,       
          displayDatePicker: true, 
          displayTimePicker: true,
          displayParentUPComponent: true,
          displayDetailedTravelPreferences: true,
          displayGetNeighborhoodsButton: true,
          displayNeighborhoodRecommendations: true,

        },
        {   
          pageStep: "20T",
          itineraryItemsState: itineraryItemsState,
          displayItinerary: true,
          displayDirectionsMap: true,
          createButtonText:"regenerate itinerary",
          getNeigborhoodButtonText:"regenerate neighborhoods",
          displayDestinationInput: true,
          displayIntroText: false,       
          displayDatePicker: true, 
          displayTimePicker: true,
          displayParentUPComponent: true,
          displayDetailedTravelPreferences: true,
        }
      ]


return (
  <div className={styles.pageComponentContainer}>
    {pageProps.map(props => (
      curStep === props.pageStep && 
      !stateVariables.isLoading &&
      (
        <AIInitForm 
              key={uuidv4()} 
              {...props} 
              handleInputChange={handleInputChange}
              />)
          ))}
    {stateVariables.isLoading && (<IsLoadingPage />)}
          {props.children}
  </div>
);
          }
export default AIItinContainer;