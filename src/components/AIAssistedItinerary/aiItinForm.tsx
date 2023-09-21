import React, { useEffect } from 'react';
import WelcomeText from "./aiFormComponents/welcomeText";
import CreateItineraryButton from "./aiFormComponents/createItineraryButton";
import styles from "./aiItinBuilderCSS/itinForm.module.css";
import { DefinedProps} from "../typeDefs" 
import Itinerary from "./aiFormComponents/itinerary";
import GeneralTravelPreferences from "./aiFormComponents/FormComponentsTravelPreferences/parentGeneralTP"
import ParentUPComponent from "./aiFormComponents/FormComponentsUserPreferences/parentUPComponent";
import DetailedTravelPreferences from "./aiFormComponents/FormComponentsTravelPreferences/parentDetailedTP";
import GoogleMapIframe from "./aiFormComponents/directionsMap";
const { v4: uuidv4 } = require('uuid');
import ParentAffiliateSection from "./aiFormComponents/FormComponentsAffiliates/parentAffiliatesSection"
import ParentNeighborhoodSection from "./aiFormComponents/FormComponentsNeighborhood/parentNeighborhoodSection"
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import Login component with SSR disabled
const Login = dynamic(() => import('../FirebaseAuthComponents/login'), { ssr: false });



const AIInitForm: React.FC<DefinedProps> = (props) => {


  return (
    <div className={styles.pageComponentContainer}>
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
        <GoogleMapIframe  />} 

        <ParentAffiliateSection />
        <div className="agreementLinks"
          style={{display: "flex", justifyContent: "center", width: "100%",
           fontSize: "0.8rem"}}>
          <div className="privacyPolicyLink">
            <Link href="/privacyPolicy">
                <span style={{color: "grey", textDecoration: "none", marginRight: "1rem"}}>
                    privacy policy
                </span>
            </Link>
          </div>
          <div className="termsOfUse">
              <Link href="/termsOfUse">
                  <span style={{color: "grey", textDecoration: "none"}}>
                      terms of use
                  </span>
              </Link>
          </div>
        </div>
   </div>
      );
};


export default AIInitForm;