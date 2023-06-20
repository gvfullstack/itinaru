import * as React from 'react';
import { useState, useCallback, useEffect } from "react";
import {
  useRecoilState, RecoilState
} from 'recoil';
import InitForm from "./itinForm";
import IsLoadingPage from '@/components/isLoadingPage';
import styles from '../../styles/ItinBuilder.module.css';
import { curStepState, itineraryItemsState
} from "../../../src/atoms/atoms"
const { v4: uuidv4 } = require('uuid');
import { HandleInputChange, MultiSelectHandler, DefinedProps } from "../typeDefs" 


type StateVariables = {
  [key:string]: any;
  isLoading?: boolean;
  }

const ItinBuilder = (props: any) => {
  const [curStep, setCurStepState] = useRecoilState(curStepState);


  const [stateVariables, setStateVariables] = useState<StateVariables>({
    isLoading: false,    
  })

  const createButtonText = "create itinerary now!";
  

  const handleInputChange:HandleInputChange = useCallback((key, value) => {
      setStateVariables((prevInputs) => ({ ...prevInputs, [key]: value }));
      console.log("state variable",{stateVariables})
  }, [stateVariables]);


  const pageProps: (DefinedProps[] )   =
      [
        {
          pageStep: "10T",
          prevPageStep: "10T",
          nextPageStep: "20T",
          createButtonText: createButtonText,
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
          createButtonText:"Regenerate Itinerary"
        }
      ]


return (
  <div className={styles.pageComponentContainer}>
    {pageProps.map(props => (
      curStep === props.pageStep && 
      !stateVariables.isLoading &&
      (
        <InitForm 
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
export default ItinBuilder;