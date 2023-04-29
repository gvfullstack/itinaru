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
    const baseUrl = 'http://localhost:3000';
    const selectedThemeOptions = themeOptions.filter((theme: { label: string, selected: boolean}) => theme.selected === true).map((theme)=>theme.label).join(',');
    const inScopeThemes = selectedThemeOptions + ',' + userDefinedThemes;
    const inScopeAgeRanges = ageRangeOptions.filter((ageRange: { label: string, selected: boolean}) => ageRange.selected === true).map((ageRange)=>ageRange.label).join(',');
    const neighborhoodSelections = neighborhoods.filter((neighborhood: Neighborhoods) => neighborhood.selected === true).map((neighborhood)=>neighborhood.neighborhood).join(',');
    

    axios.post(baseUrl +'/api/itinaru/trip', 
    {
      destination: destination, 
      selectedPace: selectedPace,
      itinEndTime: itinEndTime,
      itinStartTime: itinStartTime,
      specificSites: specificSites,
      excludedSites: excludedSites,
      travelerCount: travelerCount,
      inScopeAgeRanges: inScopeAgeRanges,
      inScopeThemes: inScopeThemes, 
      neighborhoodSelections: neighborhoodSelections,
      perPersonAverageBudget: perPersonAverageBudget,
      travelDate: travelDate
    }) 
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
      const startTime ={ time: new Date("1970-01-01T" + itineraryItem.startTime), beingEdited: false};
      const endTime = {time: new Date("1970-01-01T" + itineraryItem.endTime), beingEdited: false};                                                  
      return {...itineraryItem, 
            descHidden: true, 
            id: uuidv4(), 
            startTime: startTime,
            endTime: endTime}
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