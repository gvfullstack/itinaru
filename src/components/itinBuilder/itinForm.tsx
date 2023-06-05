import WelcomeText from "../welcomeText";
import CreateItineraryButton from "../createItineraryButton";
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
import { itineraryItemsState, tripPreferencesAtom } from "@/atoms/atoms";
import GoogleMapIframe from "@/components/directionsMap";

const { v4: uuidv4 } = require('uuid');

import { useRecoilState } from 'recoil';
const apiKey = process.env.REACT_APP_GOOGLE_MAP_API??"";

const InitForm: React.FC<DefinedProps> = (props) => {
  console.log("PageComponent just REDENDERED")
   
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
        {props.displayParentUPComponent && <ParentUPComponent />}
        {props.displayDetailedTravelPreferences && <DetailedTravelPreferences />}
        {props.displayNeighborhoodRecommendations && <NeighborhoodRecommendations />}

      {props.displayItinerary && <Itinerary />}
            

      {props.displayGetNeighborhoodsButton &&   
        <GetNeighborhoodSuggestions          
           handleInputChange={props.handleInputChange} 
      />}

      {props.createButtonText &&
       <CreateItineraryButton 
          key={uuidv4()}
          createButtonText={props.createButtonText}
          handleInputChange={props.handleInputChange} 
          />}
          
        {props.displayDirectionsMap && 
        <GoogleMapIframe apiKey="AIzaSyBjW48cII6YeZGXUjCH9xNO916hhKWe_t8" />} 

   </div>

          
      );
};


export default InitForm;