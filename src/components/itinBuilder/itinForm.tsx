import React, { useEffect } from 'react';
import WelcomeText from "../welcomeText";
import CreateItineraryButton from "../createItineraryButton";
import CreateItineraryButton2 from "../createItineraryButton";
import BackButton from "../backButton";
import styles from "../itinBuilderCSS/itinForm.module.css";
import { DefinedProps,ItineraryItem, NeighborhoodRecommendationList, 
  NeighborhoodRecommendation } from "../typeDefs" 
import Itinerary from "../itinerary";
import UserInputTimePicker from "../FormComponentsTravelPreferences/tpTimePicker";
import UserInputDatePicker from "../FormComponentsTravelPreferences/tpDatePicker";
import DestinationInput from "../FormComponentsTravelPreferences/tpDestinationInput";
import ParentUPComponent from "../FormComponentsUserPreferences/parentUPComponent";
import DetailedTravelPreferences from "../FormComponentsTravelPreferences/parentDetailedTP";
import NeighborhoodRecommendations from "../neighborhoodSuggestionsAndSelections";
import GetNeighborhoodSuggestions from "../getNeighborhoodsButton";
import { neighborhoodRecommendationList, itineraryItemsState } from "@/atoms/atoms";
import GoogleMapIframe from "@/components/directionsMap";
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import ParentAffiliateSection from "../FormComponentsAffiliates/parentAffiliatesSection"
import ParentNeighborhoodSection from "../FormComponentsNeighborhood/parentNeighborhoodSection"

const InitForm: React.FC<DefinedProps> = (props) => {
  console.log("PageComponent just REDENDERED")   
  const [neighborhoodRecommendationListVal, setNeighborhoodRecommendationListVal] = useRecoilState(neighborhoodRecommendationList)
  const showNeighborhoodList = neighborhoodRecommendationListVal.showNeighborhoodList ? neighborhoodRecommendationListVal.showNeighborhoodList : false
  const [itinerary, setItinerary] = useRecoilState(itineraryItemsState)

  return (
    <div className={styles.pageComponentContainer} style  ={{}}>
        <button onClick = {()=>console.log(itinerary)}>prompt</button>
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
        {/* {props.displayNeighborhoodRecommendations && showNeighborhoodList && <NeighborhoodRecommendations />} */}
        {/* {props.displayGetNeighborhoodsButton &&   
          <GetNeighborhoodSuggestions          
            handleInputChange={props.handleInputChange} 
        />} */}
        <ParentNeighborhoodSection 
          handleInputChange={props.handleInputChange} 
          getNeigborhoodButtonText={props.getNeigborhoodButtonText}
          />
        
        {props.displayItinerary && <Itinerary />}
        <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleInputChange={props.handleInputChange} 
          />
          
        {props.displayDirectionsMap && 
        <GoogleMapIframe apiKey="AIzaSyBjW48cII6YeZGXUjCH9xNO916hhKWe_t8" />} 

        <ParentAffiliateSection />
        
   </div>
      );
};


export default InitForm;