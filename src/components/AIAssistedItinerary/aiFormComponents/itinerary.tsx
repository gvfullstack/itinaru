import React, {useEffect, useState} from "react";
import { itineraryItemsState, tripPreferencesAtom, userPreferencesAtom } from '../aiItinAtoms';
import { useRecoilState } from 'recoil';
import styles from '../aiItinBuilderCSS/itinerary.module.css';
import { ItineraryItem } from "../aiItinTypeDefs";
import DraggableItineraryItem from './draggableItineraryItem';
import DroppableItineraryContainer from './droppableItineraryContainer';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getSelectedUserPreferences } from "./FormComponentsUserPreferences/getUserPreferences";
import { getSelectedTripPreferences } from "./FormComponentsTravelPreferences/getTravelPreferences";
import getConfig from 'next/config';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCrosshairs, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';


const Itinerary: React.FC = () => {
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);

  const floppyDiskAddSave = (
    <FontAwesomeIcon 
        icon={faFloppyDisk as any} 
        className={styles.floppyDisk} 
        type="button" 
    />
);
  
const trashDelete = (
    <FontAwesomeIcon 
        icon={faTrashCan} 
        className={styles.trashIcon} 
        type="button" 
    />
);
  const handleShowHideDescription = (curItineraryItem: ItineraryItem) => {
    setItineraryItems(prevState => {
      const updatedNeighborhoods = prevState.map((itineraryItem) => {
        if(curItineraryItem.siteName === itineraryItem.siteName) {
          return {...itineraryItem, descHidden: !itineraryItem.descHidden}
        }
        else {       
          return itineraryItem}
      })
      return updatedNeighborhoods;
    });
  };

  const destination = tripPreferences.destination?tripPreferences.destination
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";  
  
  const travelDate = new Date(tripPreferences.travelDate??"");


  const formattedTravelDate = travelDate.toLocaleDateString("en-US", {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const AddMenu = () => {
  
    const items = ["Non-Meal Site", "Coffee Shop", "Breakfast", "Brunch", "Lunch", "Dinner"];
  
    return (
      <div className={`${styles.addMenu}`}>
        <div className={styles.menuItem} style={{}}>Add to itinerary:</div>
        {items.map(item => (
          <div 
            key={item} 
            className={styles.menuItem}
            onClick={() =>{ setSelectedItem(item); setAddMenuOpen(false); handleClickAdd()}}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };
  const [replacementLoading, setReplacementLoading] = useState(false);
  const [itineraryItemsInState, setItineraryItemsInState] = useRecoilState<ItineraryItem[]>(itineraryItemsState);

  const handleClickAdd = async () => {
    const destination = tripPreferences.destination;
    const neighborhoodsToExplore = tripPreferences.neighborhoodsToExplore??[];
    const neighborhoods = neighborhoodsToExplore.join(', ')
    const itinPreferences = getSelectedTripPreferences(tripPreferences) + getSelectedUserPreferences(userPreferences);
    const placesInItinerary = itineraryItemsInState.map(item => item.siteName).join(",");
    const prompt = `For a tourist visiting ${neighborhoodsToExplore.length >0 ? neighborhoods: ""} in ${destination} whose itinerary already contains these sites: ${placesInItinerary} (those should not be repeated), please provide a  ${selectedItem === "Non-Meal Site" ? `${selectedItem} non-meal site suggestion` : `${selectedItem} restaurant suggestion`}. The traveler preferences are as follows: ${itinPreferences}. The suggestion should in JSON object format i.e. begin with "{" and end with "}", and follow this structure exactly: {"activityType": "<Coffee Shop/Tourist Site to Visit/Self Guided Activity>", "siteName": "<name>", "description": "<description>", "locationAddress": "<address>".} `;
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.BASE_URL;

    const response = await fetch(baseUrl + '/api/GPT/GPTRequest', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
  
    if (!response.ok) { 
      throw new Error(response.statusText);
    }
    const data = response.body;
    if (!data) {
    return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    let bracketCount = 0;
    let completeObjectReceived = false;
    let addBrace = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value, {stream: !doneReading});
        // Removing leading whitespaces
      chunkValue = addBrace ? chunkValue.trimStart() : chunkValue;
      // If the first character is not '{', add it
      if (addBrace && chunkValue[0] !== "{") {
        chunkValue = "{" + chunkValue;
      }
      // Set addBrace to false after the first chunk
      addBrace = false;

      for (const char of chunkValue) {
        if (char === "{") {
          buffer += char;
          bracketCount++;
        } else if (char === "}") {
          buffer += char;
          bracketCount--;
          if (bracketCount === 0 && buffer.length > 0) {
            // Complete object found in the buffer
            completeObjectReceived = true;
          }
        } else {
          buffer += char;
        }
  
        if (completeObjectReceived && bracketCount === 0) {
          try {
            const startTime = new Date(travelDate.getTime());
            const endTime = new Date(travelDate.getTime());
            // Set the hours for startTime and endTime.
            startTime.setHours(8); // Set the hour to 8am
            startTime.setMinutes(0); // Ensure the minutes are set to 0
            endTime.setHours(8); // Set the hour to 2pm
            endTime.setMinutes(30); 
            const newObj = JSON.parse(buffer);
            newObj.startTime = {beingEdited: false, time: startTime};
            newObj.endTime = {beingEdited: false, time: endTime};
            newObj.userDefinedRespectedTime = false;
            newObj.activityDuration = endTime.getTime() - startTime.getTime(); ;
            newObj.descHidden = true;
            newObj.id = uuidv4();
            const updatedItems = [...itineraryItemsInState];
            updatedItems.push(newObj);
            setItineraryItemsInState(updatedItems);
            
          } catch(error) {
            console.log("Error parsing JSON: ", error);
          } finally {
            setReplacementLoading(false);
            // Clear buffer and flags for the next object
            buffer = '';
            completeObjectReceived = false;
          }
        }
      }
    }
  };

  const sign = addMenuOpen ? "-" : "+"
  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      <div className={styles.utilitySection}>
        {/* <button className={styles.shareItineraryButton}>share</button> */}
        <button className={styles.addItineraryItemButton} onClick={()=>setAddMenuOpen(!addMenuOpen)}>
          <span className={styles.plusSignText}> itinerary item</span> {sign}
        </button>
      </div>
      <div className = {styles.addMenuContainer}>
        {addMenuOpen && <AddMenu />}
      </div>
      <p>
        {`My trip to ${destination} on ${formattedTravelDate}`}
      </p>
        <DroppableItineraryContainer
          handleShowHideDescription={handleShowHideDescription}
        />
    </div>
    
  </DndProvider>
  );
};

export default Itinerary;
