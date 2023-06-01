import React from "react";
import styles from "./itinBuilderCSS/createItineraryButton.module.css";
import { DefinedProps } from "@/components/typeDefs";
import axios from 'axios';
import { curStepState, userPreferencesAtom, 
  tripPreferencesAtom, neighborhoodRecommendationList

} from "../atoms/atoms"
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import getConfig from 'next/config';
import { getSelectedUserPreferences } from "./FormComponentsUserPreferences/getUserPreferences";
import { getSelectedTripPreferencesNeighborhoods } from "./FormComponentsTravelPreferences/getTravelPreferences";

const GetNeighborhoodSuggestions: React.FC<DefinedProps> = (props) => {

  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const destination = tripPreferences.destination;
   
  const [neighborhoodRecommendationsArr, setNeighborhoodRecommendationsArr] = useRecoilState(neighborhoodRecommendationList);
  const [curStep, setCurStep] = useRecoilState(curStepState);
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.BASE_URL;
  let disabled = !destination ? true : false;
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};


  const itinPreferences = getSelectedTripPreferencesNeighborhoods(tripPreferences) + getSelectedUserPreferences(userPreferences)

  const apiExecutionBlock = () => {
    handleInputChange("isLoading", true);
    axios.post(baseUrl +'/api/neighborhood/neighborhoodSuggestions', 
    {itinPreferences: itinPreferences,
     destination: destination}
    ) 
      .then((response) => { 
        setCurStep("20T");
        console.log("success", response.data.neighborhoodSuggestions);
        // updateNeighborhoodList(response.data.neighborhoodSuggestions);
        setNeighborhoodRecommendationsArr({neighborhoodRecommendationArray: response.data.neighborhoodSuggestions})
      }).catch((error) => {
        console.log("error", error);
      }).finally(() => {
        handleInputChange("isLoading", false);
        console.log("neighborhoodRecommendationsArr", neighborhoodRecommendationsArr);
      });
    }

  const handleClick = () => {
      apiExecutionBlock();
  }

  return (
    <div className={styles.createItineraryButtonContainer}>
      <button className={`${styles.createItineraryButton} ${disabled? styles.disabled:""}`} disabled={disabled} onClick={handleClick}>Recommend Neighborhoods</button>
    </div>
  );
};

export default GetNeighborhoodSuggestions;