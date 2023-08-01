import React, { useEffect } from 'react';
import WelcomeText from "../welcomeText";
import CreateItineraryButton from "../createItineraryButton";
import CreateItineraryButton2 from "../createItineraryButton";
import BackButton from "../backButton";
import styles from "../itinBuilderCSS/itinForm.module.css";
import { DefinedProps} from "../typeDefs" 
import Itinerary from "../itinerary";
import GeneralTravelPreferences from "../FormComponentsTravelPreferences/parentGeneralTP"
import ParentUPComponent from "../FormComponentsUserPreferences/parentUPComponent";
import DetailedTravelPreferences from "../FormComponentsTravelPreferences/parentDetailedTP";
import { neighborhoodRecommendationList, itineraryItemsState } from "@/atoms/atoms";
import GoogleMapIframe from "@/components/directionsMap";
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import ParentAffiliateSection from "../FormComponentsAffiliates/parentAffiliatesSection"
import ParentNeighborhoodSection from "../FormComponentsNeighborhood/parentNeighborhoodSection"
const InitForm: React.FC<DefinedProps> = (props) => {

  return (
    <div className={styles.pageComponentContainer} style  ={{}}>
        <a 
        href=
        "https://www.google.com/maps/dir/?api=1&origin=37.3653504,-122.028032&destination=300%20Webster%20St%2C%20Oakland%2C%20CA%2094607&travelmode=driving">
          Open Map</a>

        {props.displayIntroText && <WelcomeText 
              introText={props.introText}
              infoText1={props.infoText1}
              infoText2={props.infoText2}
              prompt={props.prompt}
              pageStep={props.pageStep}
              />}
        <GeneralTravelPreferences />
        <DetailedTravelPreferences />
        <ParentUPComponent />
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