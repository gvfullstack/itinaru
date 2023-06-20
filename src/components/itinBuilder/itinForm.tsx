import React, { useEffect } from 'react';
import WelcomeText from "../welcomeText";
import CreateItineraryButton from "../createItineraryButton";
import CreateItineraryButton2 from "../createItineraryButton";
import BackButton from "../backButton";
import styles from "../itinBuilderCSS/itinForm.module.css";
import { DefinedProps,ItineraryItem, NeighborhoodRecommendationList, NeighborhoodRecommendation } from "../typeDefs" 
import Itinerary from "../itinerary";
import UserInputTimePicker from "../FormComponentsTravelPreferences/tpTimePicker";
import UserInputDatePicker from "../FormComponentsTravelPreferences/tpDatePicker";
import DestinationInput from "../FormComponentsTravelPreferences/tpDestinationInput";
import ParentUPComponent from "../FormComponentsUserPreferences/parentUPComponent";
import DetailedTravelPreferences from "../FormComponentsTravelPreferences/parentDetailedTP";
import NeighborhoodRecommendations from "../neighborhoodSuggestionsAndSelections";
import GetNeighborhoodSuggestions from "../getNeighborhoodsButton";
import { neighborhoodRecommendationList } from "@/atoms/atoms";
import GoogleMapIframe from "@/components/directionsMap";
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');


const InitForm: React.FC<DefinedProps> = (props) => {
  const [neighborhoodRecommendationListVal, setNeighborhoodRecommendationListVal] = useRecoilState(neighborhoodRecommendationList)
  const showNeighborhoodList = neighborhoodRecommendationListVal.showNeighborhoodList ? neighborhoodRecommendationListVal.showNeighborhoodList : false
  console.log("PageComponent just REDENDERED")
   
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.viator.com/orion/partner/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);
  


  return (
    <div className={styles.pageComponentContainer} style  ={{}}>
        {props.displayIntroText && <WelcomeText 
              introText={props.introText}
              infoText1={props.infoText1}
              infoText2={props.infoText2}
              prompt={props.prompt}
              pageStep={props.pageStep}
              />}
        <div style={{margin:"10rem, 0rem"}}>
          {props.displayDestinationInput && <DestinationInput />}
        </div>
        {props.displayDatePicker && <UserInputDatePicker />}
        {props.displayTimePicker && <UserInputTimePicker />}
        {props.displayDetailedTravelPreferences && <DetailedTravelPreferences />}
        {props.displayParentUPComponent && <ParentUPComponent />}
        {props.displayNeighborhoodRecommendations && showNeighborhoodList && <NeighborhoodRecommendations />}
        {props.displayItinerary && <Itinerary />}
        {props.displayGetNeighborhoodsButton &&   
          <GetNeighborhoodSuggestions          
            handleInputChange={props.handleInputChange} 
        />}

        <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleInputChange={props.handleInputChange} 
          />
          
        {props.displayDirectionsMap && 
        <GoogleMapIframe apiKey="AIzaSyBjW48cII6YeZGXUjCH9xNO916hhKWe_t8" />} 

        <div 
          data-vi-partner-id="P00107668" 
          data-vi-widget-ref="W-8277e1bf-c7b3-4515-a7e8-db4561cf6a8a"
        />  
        
   </div>
      );
};


export default InitForm;