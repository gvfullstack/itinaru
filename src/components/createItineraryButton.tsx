"use client";
import React from "react";
import styles from "./itinBuilderCSS/createItineraryButton.module.css";
import { DefinedProps, Itinerary, ItineraryItem} from "@/components/typeDefs";
import { userPreferencesAtom, tripPreferencesAtom, itineraryItemsState,
   curStepState, neighborhoodRecommendationList} from "../atoms/atoms"
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import getConfig from 'next/config';
import { getSelectedUserPreferences } from "./FormComponentsUserPreferences/getUserPreferences";
import { getSelectedTripPreferences } from "./FormComponentsTravelPreferences/getTravelPreferences";


const CreateItineraryButton2: React.FC<DefinedProps> = (props) => {
    const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
    const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
    const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
    const [neighborhoodRecommendation, setNeighborhoodRecommendation] = useRecoilState(neighborhoodRecommendationList);
  
    const destination = tripPreferences.destination;
    const neighborhoodsToExplore = tripPreferences.neighborhoodsToExplore??[];
    const neighborhoods = neighborhoodsToExplore.join(', ')
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.BASE_URL;

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
  
    const travelDate: Date | undefined = tripPreferences.travelDate ?? undefined;
    const tpStartTime = tripPreferences.startTime ?? new Date()
    const tpEndTime = tripPreferences.endTime ?? new Date()

    const [curStep, setCurStep] = useRecoilState(curStepState);
    const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);
    const preferredPace = userPreferences.preferredPace.find((option) => option.selected === option.label)?.label;
    let startTime = formatTime(tpStartTime??new Date());
    let endTime = formatTime(tpEndTime?? new Date());
    const itinPreferences = getSelectedTripPreferences(tripPreferences) + 
    getSelectedUserPreferences(userPreferences);
    
    const checkHoursElapsed = (start: Date, end: Date, eventStart: number, eventEnd: number) => {
      const startHour = start.getHours();
      const endHour = end.getHours();
      return (eventStart >= startHour && endHour >= eventStart) || 
      (eventEnd >= startHour && endHour >= eventEnd);
    };  
    const promptArray : string[] = []
    const includeCoffee = checkHoursElapsed(tpStartTime, tpEndTime, 6, 10)
    const coffeePrompt = "a coffee shop suggestion"
    if(includeCoffee) {promptArray.push(coffeePrompt)}
    const veryEarlyStartObj : { [key: string]: number }= {"Relaxed": 3, "Moderate": 3, "Fast-Paced": 3}
    const veryEarlyEndObj : { [key: string]: number } = {"Relaxed": 10, "Moderate": 9, "Fast-Paced": 8}
    const veryEarlyStartTime = preferredPace ? veryEarlyStartObj[preferredPace]:5
    const veryEarlyEndTime = preferredPace ? veryEarlyEndObj[preferredPace]:8
    const includeVeryEarlySite = checkHoursElapsed(tpStartTime, tpEndTime, veryEarlyStartTime, veryEarlyEndTime)
    const veryEarlyPrompt = "a site to visit very early in the morning"
    if(includeVeryEarlySite){promptArray.push(veryEarlyPrompt)}
    const includeBreakfast = checkHoursElapsed(tpStartTime, tpEndTime, 6, 11)
    const breakfastPrompt = "a breakfast restaurant suggestion"
    if(includeBreakfast){promptArray.push(breakfastPrompt)}
    const midMornStartObj : { [key: string]: number }= {"Relaxed": 11, "Moderate": 9, "Fast-Paced": 8}
    const midMornEndObj : { [key: string]: number } = {"Relaxed": 13, "Moderate": 12, "Fast-Paced": 10}
    const midMornStartTime = preferredPace ? midMornStartObj[preferredPace]:10
    const midMornEndTime = preferredPace ? midMornEndObj[preferredPace]:12
    const includeMidMorningSite = checkHoursElapsed(tpStartTime, tpEndTime, midMornStartTime, midMornEndTime)
    const midMorningPrompt = "a site to visit mid morning"
    if(includeMidMorningSite){promptArray.push(midMorningPrompt)}
    const lateMornStartObj : { [key: string]: number }= {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 10}
    const lateMornEndObj : { [key: string]: number } = {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 13}
    const lateMornStartTime = preferredPace ? lateMornStartObj[preferredPace]:0
    const lateMornEndTime = preferredPace ? lateMornEndObj[preferredPace]:0
    const includeLateMorning = checkHoursElapsed(tpStartTime, tpEndTime, lateMornStartTime, lateMornEndTime)
    const lateMorningPrompt = "a site to visit late morning"
    if(includeLateMorning){promptArray.push(lateMorningPrompt)}
    const includeLunch = checkHoursElapsed(tpStartTime, tpEndTime, 11, 15)
    const lunchPrompt = "a lunch restaurant suggestion"
    if(includeLunch){promptArray.push(lunchPrompt)}
    const afternoonStartObj : { [key: string]: number }= {"Relaxed": 13, "Moderate": 13, "Fast-Paced": 13}
    const afternoonEndObj : { [key: string]: number } = {"Relaxed": 16, "Moderate": 15, "Fast-Paced": 14}
    const afternoonStartTime = preferredPace ? afternoonStartObj[preferredPace]:13
    const afternoonEndTime = preferredPace ? afternoonEndObj[preferredPace]:15
    const includeEarlyAfternoon = checkHoursElapsed(tpStartTime, tpEndTime, afternoonStartTime, afternoonEndTime)
    const earlyAfternoonPrompt = "a site to visit early afternoon"
    if(includeEarlyAfternoon){promptArray.push(earlyAfternoonPrompt)}
    const midAfternoonStartObj : { [key: string]: number }= {"Relaxed": 16, "Moderate": 15, "Fast-Paced": 14}
    const midAfternoonEndObj : { [key: string]: number } = {"Relaxed": 18, "Moderate": 17, "Fast-Paced": 16}
    const midAfternoonStartTime = preferredPace ? midAfternoonStartObj[preferredPace]:15
    const midAfternoonEndTime = preferredPace ? midAfternoonEndObj[preferredPace]:17
    const includeMidAfternoon = checkHoursElapsed(tpStartTime, tpEndTime, midAfternoonStartTime, midAfternoonEndTime)
    const midAfternoonPrompt = "a site to visit mid afternoon"
    if(includeMidAfternoon){promptArray.push(midAfternoonPrompt)}
    const lateAfternoonStartObj : { [key: string]: number }= {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 16}
    const lateAfternoonEndObj : { [key: string]: number } = {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 18}
    const lateAfternoonStartTime = preferredPace ? lateAfternoonStartObj[preferredPace]:15
    const lateAfternoonEndTime = preferredPace ? lateAfternoonEndObj[preferredPace]:17
    const includeLateAfternoon = checkHoursElapsed(tpStartTime, tpEndTime, lateAfternoonStartTime, lateAfternoonEndTime)
    const lateAfternoonPrompt = "a site to visit late afternoon"
    if(includeLateAfternoon){promptArray.push(lateAfternoonPrompt)}
    const includeDinner = checkHoursElapsed(tpStartTime, tpEndTime, 15, 24)   
    const dinnerPrompt = "a dinner restaurant suggestion"
    if(includeDinner){promptArray.push(dinnerPrompt)}
    const eveningStartObj : { [key: string]: number }= {"Relaxed": 19, "Moderate": 18, "Fast-Paced": 18}
    const eveningEndObj : { [key: string]: number } = {"Relaxed": 24, "Moderate": 24, "Fast-Paced": 20}
    const eveningStartTime = preferredPace ? eveningStartObj[preferredPace]:18
    const eveningEndTime = preferredPace ? eveningEndObj[preferredPace]:24
    const includeEvening = checkHoursElapsed(tpStartTime, tpEndTime, eveningStartTime, eveningEndTime)
    const eveningPrompt = "a site to visit in the evening"
    if(includeEvening){promptArray.push(eveningPrompt)}
    const lateEveningStartObj : { [key: string]: number }= {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 20}
    const lateEveningEndObj : { [key: string]: number } = {"Relaxed": 0, "Moderate": 0, "Fast-Paced": 24}
    const lateEveningStartTime = preferredPace ? lateEveningStartObj[preferredPace]:0
    const lateEveningEndTime = preferredPace ? lateEveningEndObj[preferredPace]:0
    const includeLateEvening = checkHoursElapsed(tpStartTime, tpEndTime, lateEveningStartTime, lateEveningEndTime)
    const lateEveningPrompt = "a site to visit in the evening"
    if(includeLateEvening){promptArray.push(lateEveningPrompt)}
    const prompArrToInclude : string[] = promptArray.map((item, index, array) => index === 0? `provide ${item}`: array.length-1 === index ? `followed by ${item}.`:`followed by ${item}`)
    const sitePrompts = prompArrToInclude.join(',')
    const prompt = `For a tourist visiting ${neighborhoodsToExplore.length >0 ? neighborhoods: ""} in ${destination}, we want to generate a travel itinerary. Please provide each of the following as separate JSON objects: please ${sitePrompts} Each suggestion should begin with "{" and end with "}", and follow this structure exactly: "activityType": "<Coffee Shop>", "siteName": "<name>", "description": "<description>", "locationAddress": "<address>" This format is like a JSON object. Please, do not add any extra information or labels, and do not include these suggestions in a list or a larger JSON object. The personal preferences of the traveler are as follows: ${itinPreferences}` 
    
    const numberOfItinItems = prompArrToInclude.length
    const durationPerItinItem = (tpEndTime.getTime() - tpStartTime.getTime()) / numberOfItinItems
    let itinItemStartTimeTracker = tpStartTime.getTime()

    const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        setTripPreferences(prev=>({...prev, showTripPreferences: false}))
        setUserPreferences(prev=>({...prev, showUserPreferences: false}))
        setNeighborhoodRecommendation(prev=>({...prev, showNeighborhoodSection: false}))

        setItineraryItems([]);
        setCurStep("20T")
        
        const response = await fetch(baseUrl + '/api/GPT/GPTRequest', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt
            }),
          });
      
          if (!response.ok) { 
            throw new Error(response.statusText);
          }

    // This data is a ReadableStream
    const data = response.body;
        if (!data) {
        return;
        }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let contiguousBuffer = ""

    let buffer = '';
    let skipBlanks = true;
    let bracketCount = 0;
    let completeObjectReceived = false; // Track if a complete object has been received
    let addBrace = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);
      chunkValue = addBrace ? chunkValue.trimStart() : chunkValue;
      // If the first character is not '{', add it
      if (addBrace && chunkValue[0] !== "{") {
        chunkValue = "{" + chunkValue;
      }
      // Set addBrace to false after the first chunk
      addBrace = false;

      for (const char of chunkValue) {
        if (skipBlanks && (char === " " || char === "")) {
          continue; // Skip blank characters before '{'
        }
    
        if (char === "{") {
          skipBlanks = false; // Stop skipping blanks after encountering '{'
          buffer += char;
          contiguousBuffer += char
          bracketCount++;
        } else if (char === "}") {
          buffer += char;
          contiguousBuffer += char
          bracketCount--;
        } else if (char === "[") {
          continue;
        } else if (char === "]") {
          continue;
        }else {
          buffer += char;
          contiguousBuffer += char
        }
    
        if (bracketCount === 0 && buffer.length > 0) {
          // Complete object found in the buffer
          completeObjectReceived = true;
        }
    
        if (completeObjectReceived && bracketCount === 0) {
         try{
          const newObj = JSON.parse(buffer);

          const sTime = itinItemStartTimeTracker;
          const startTime = { time: new Date(sTime), beingEdited: false };
          const eTime = itinItemStartTimeTracker + durationPerItinItem
          const endTime = { time: new Date (eTime), beingEdited: false };
          itinItemStartTimeTracker += durationPerItinItem
          
          newObj.startTime = startTime;
          newObj.endTime = endTime;
          newObj.userDefinedRespectedTime = false;
          newObj.activityDuration = durationPerItinItem;
          newObj.descHidden = true
          newObj.id = uuidv4()
          setItineraryItems(prev => [...prev, newObj]);
    
          // Reset the buffer for the next JSON object
          buffer = '';
          completeObjectReceived = false;
        } catch(error){
          console.error("Error parsing JSON object:", error);

        }
        }
      }
    }
    }

    let disabled = !destination ? true : false;

    return (
        <div className={styles.createItineraryButtonContainer}>
          <button className={`${styles.createItineraryButton} ${disabled? styles.disabled:""}`} disabled={disabled} onClick={generateResponse}>{props.createButtonText}</button>
        </div>
      );
}

export default CreateItineraryButton2;

