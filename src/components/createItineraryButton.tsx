
import React from "react";
import styles from "./itinBuilderCSS/createItineraryButton.module.css";
import { DefinedProps} from "@/components/typeDefs";
import axios from 'axios';
import { userPreferencesAtom, tripPreferencesAtom, itineraryItemsState, curStepState} from "../../src/atoms/atoms"
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import getConfig from 'next/config';
import { getSelectedUserPreferences } from "./FormComponentsUserPreferences/getUserPreferences";
import { getSelectedTripPreferences } from "./FormComponentsTravelPreferences/getTravelPreferences";


const CreateItineraryButton: React.FC<DefinedProps> = (props) => {
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const destination = tripPreferences.destination;
  const neighborhoodsToExplore = tripPreferences.neighborhoodsToExplore??[];
  const neighborhoods = (() => {
    let neighborhoodString = '';
    for (let i = 0; i < neighborhoodsToExplore.length; i++) {
      if (i === neighborhoodsToExplore.length - 1) {
        neighborhoodString += ", and " + neighborhoodsToExplore[i];
      } else {
        neighborhoodString += ", " + neighborhoodsToExplore[i];
      }
    }
    return neighborhoodString;
  }) ()
  ;
  function formatTime(unformattedDate:Date) {
    const date = new Date(unformattedDate);
  
    // Extract the hour and minute components
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    // Convert the hour to 12-hour format
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  
    // Determine the meridiem (am/pm)
    const meridiem = hour < 12 ? "am" : "pm";
  
    // Construct the formatted time string
    const formattedTime = `${formattedHour}:${minute.toString().padStart(2, "0")}${meridiem}`;
  
    return formattedTime;
  }

  const travelDate = tripPreferences.travelDate;
  const [curStep, setCurStep] = useRecoilState(curStepState);
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);
  let startTime = formatTime(tripPreferences.startTime??new Date());
  let endTime = formatTime(tripPreferences.endTime?? new Date());

  const apiExecutionBlock = () => {
    console.log("neighborhoods in trip", neighborhoods)
    console.log(getSelectedTripPreferences(tripPreferences) + getSelectedUserPreferences(userPreferences))
    
    const itinPreferences = getSelectedTripPreferences(tripPreferences) + getSelectedUserPreferences(userPreferences);
    
    handleInputChange("isLoading", true);
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.BASE_URL;
    

    axios.post(baseUrl +'/api/itinaru/trip', 
    {
      itinPreferences: itinPreferences, 
      destination: destination,
      neighborhoods: neighborhoods,
      startTime: startTime,
      endTime: endTime,
    }
    ) 
      .then((response) => { 
        setCurStep("30T");
        console.log("success", response.data.itinaru);
        updateItineraryHiddenStatus(response.data.itinaru);
        
      }).catch((error) => {
        console.log("error", error);
      }).finally(() => {handleInputChange("isLoading", false); console.log(itineraryItems)});
  }

  const updateItineraryHiddenStatus = (itineraryItems: any[]) => {
    const itineraryItemsWithSelectedFalse = itineraryItems.map((itineraryItem: any) => {
      const sTime = new Date(travelDate ? travelDate : new Date());
      if (itineraryItem.suggestedStartTime) {
        const [startHours, startMinutes] = itineraryItem.suggestedStartTime.split(':');
        const [startMinutesValue, amPm] = startMinutes.split(/(?=[ap]m)/i);
  
        let hours = parseInt(startHours, 10);
        if (amPm.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (amPm.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
  
        sTime.setHours(hours, parseInt(startMinutesValue, 10));
      }
  
      const startTime = { time: sTime, beingEdited: false };
  
      const eTime = new Date(travelDate ? travelDate : new Date());
      if (itineraryItem.suggestedEndTime) {
        const [endHours, endMinutes] = itineraryItem.suggestedEndTime.split(':');
        const [endMinutesValue, amPm] = endMinutes.split(/(?=[ap]m)/i);
  
        let hours = parseInt(endHours, 10);
        if (amPm.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (amPm.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
  
        eTime.setHours(hours, parseInt(endMinutesValue, 10));
      }
  
      const endTime = { time: eTime, beingEdited: false };
      const userDefinedRespectedTime = false;
      const activityDuration = endTime.time.getTime() - startTime.time.getTime();
  
      return {
        ...itineraryItem,
        descHidden: true,
        id: uuidv4(),
        startTime: startTime,
        endTime: endTime,
        userDefinedRespectedTime: userDefinedRespectedTime,
        activityDuration: activityDuration,
      };
    });
  
    setItineraryItems(itineraryItemsWithSelectedFalse);
  };

  const handleClick = () => {
      apiExecutionBlock();
  }

  let disabled = !destination ? true : false;

  return (
    <div className={styles.createItineraryButtonContainer}>
      <button className={`${styles.createItineraryButton} ${disabled? styles.disabled:""}`} disabled={disabled} onClick={handleClick}>{props.createButtonText}</button>
    </div>
  );
};

export default CreateItineraryButton;