import React from "react";
import styles from "./itinBuilderCSS/createItineraryButton.module.css";
import { DefinedProps, Neighborhoods } from "@/typeDefs";
import axios from 'axios';
import { neighborhoodsState, curStepState, destinationState,
  userDefinedThemesState, themeOptionsState, ageRangeOptionsState, itineraryItemsState,
  selectedPaceState,  itinStartTimeState, itinEndTimeState, specificSitesState,
  excludedSitesState, travelerCountState, travelDateState, perPersonAverageBudgetState

} from "../../src/atoms/atoms"
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import getConfig from 'next/config';

const CreateItineraryButton: React.FC<DefinedProps> = (props) => {
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  
  const [destination, setDestinationOptions] = useRecoilState(destinationState);
  const [selectedPace, setSelectedPace] = useRecoilState(selectedPaceState);
  const [itinStartTime, setItinStartTime] = useRecoilState(itinStartTimeState);
  const [itinEndTime, setItinEndTime] = useRecoilState(itinEndTimeState);
  const [specificSites, setSpecificSites] = useRecoilState(specificSitesState);
  const [excludedSites, setExcludedSites] = useRecoilState(excludedSitesState);
  const [travelerCount, setTravelerCount] = useRecoilState(travelerCountState);
  const [ageRangeOptions, setAgeRangeOptions] = useRecoilState(ageRangeOptionsState);
  const [themeOptions, setThemeOptions] = useRecoilState(themeOptionsState);
  const [userDefinedThemes, setUserDefinedThemes] = useRecoilState(userDefinedThemesState);
  const [neighborhoods, setNeighborhoods] = useRecoilState(neighborhoodsState);
  const [travelDate, setTravelDate] = useRecoilState(travelDateState);
  const [perPersonAverageBudget, setPerPersonAverageBudget] = useRecoilState(perPersonAverageBudgetState);


  const [curStep, setCurStep] = useRecoilState(curStepState);
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);
 

  const apiExecutionBlock = () => {
    console.log("destination", destination, "selectedPace", selectedPace, "itinStartTime", 
    itinStartTime, "itinEndTime", itinEndTime, "specificSites", specificSites, "excludedSites", 
    excludedSites, "travelerCount", travelerCount, "ageRangeOptions", ageRangeOptions, 
    "themeOptions", themeOptions, "userDefinedThemes", userDefinedThemes, "neighborhoods", 
    neighborhoods, "travelDate", travelDate, "perPersonAverageBudget", perPersonAverageBudget)

    handleInputChange("isLoading", true);
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.BASE_URL;
    const selectedThemeOptions = themeOptions.filter((theme: { label: string, selected: boolean}) => theme.selected === true).map((theme)=>theme.label).join(',');
    const inScopeThemes = selectedThemeOptions + ',' + userDefinedThemes;
    const inScopeAgeRanges = ageRangeOptions.filter((ageRange: { label: string, selected: boolean}) => ageRange.selected === true).map((ageRange)=>ageRange.label).join(',');
    const neighborhoodSelections = neighborhoods.filter((neighborhood: Neighborhoods) => neighborhood.selected === true).map((neighborhood)=>neighborhood.neighborhood).join(',');
    const paramItinStartTime = itinStartTime.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const paramItinEndTime = itinEndTime.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const paramTravelDate = travelDate ? new Date(travelDate).toISOString().substring(0, 10) : '';


    axios.post(baseUrl +'/api/itinaru/trip', 
    {
      destination: destination, 
      selectedPace: selectedPace,
      itinStartTime: paramItinStartTime,
      itinEndTime: paramItinEndTime,
      specificSites: specificSites,
      excludedSites: excludedSites,
      travelerCount: travelerCount,
      inScopeAgeRanges: inScopeAgeRanges,
      inScopeThemes: inScopeThemes, 
      neighborhoodSelections: neighborhoodSelections,
      perPersonAverageBudget: perPersonAverageBudget,
      travelDate: paramTravelDate
    },
    {
      timeout: 10000, // Timeout in milliseconds, e.g., 10000ms = 10 seconds
    }
    ) 
      .then((response) => { 
        setCurStep("120T");
        console.log("success", response.data.itinaru);
        updateItineraryHiddenStatus(response.data.itinaru);
        
      }).catch((error) => {
        console.log("error", error);
      }).finally(() => {handleInputChange("isLoading", false); console.log(itineraryItems)});
  }

  const updateItineraryHiddenStatus = (itineraryItems: any[]) => {
    const itineraryItemsWithSelectedFalse = itineraryItems.map((itineraryItem: any) => { 
        const sTime = new Date(travelDate);
        if (itineraryItem.startTime) {
          const [startHours, startMinutes] = itineraryItem.startTime.split(':');
          sTime.setHours(startHours);
          sTime.setMinutes(startMinutes);
        }
      const startTime ={ time: sTime, beingEdited: false};

        const eTime = new Date(travelDate);
        if (itineraryItem.endTime) {
          const [endHours, endMinutes] = itineraryItem.endTime.split(':');
          eTime.setHours(endHours);
          eTime.setMinutes(endMinutes);
        }

      const endTime = {time: eTime, beingEdited: false}; 
      const userDefinedRespectedTime = false;     
      const activityDuration = endTime.time.getTime() - startTime.time.getTime();       

      return {...itineraryItem, 
            descHidden: true, 
            id: uuidv4(), 
            startTime: startTime,
            endTime: endTime,
            userDefinedRespectedTime: userDefinedRespectedTime,
            activityDuration: activityDuration,
            travelDate: travelDate 
          }
    })
    setItineraryItems(itineraryItemsWithSelectedFalse)
  }

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