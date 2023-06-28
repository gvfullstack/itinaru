"use client";
import React from "react";
import { useState } from 'react';
import styles from "./itinBuilderCSS/createItineraryButton.module.css";
import { DefinedProps, NeighborhoodRecommendation } from "@/components/typeDefs";
import { curStepState, userPreferencesAtom, tripPreferencesAtom, 
  neighborhoodRecommendationList } from "../atoms/atoms"
import { useRecoilState } from 'recoil';
const { v4: uuidv4 } = require('uuid');
import getConfig from 'next/config';
import { getSelectedUserPreferences } from "./FormComponentsUserPreferences/getUserPreferences";
import { getSelectedTripPreferencesNeighborhoods } from "./FormComponentsTravelPreferences/getTravelPreferences";


const GetNeighborhoodSuggestions: React.FC<DefinedProps> = (props) => {
  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const destination = tripPreferences.destination;
  const [neighborhoodRecommendationsArr, setNeighborhoodRecommendationsArr] = useRecoilState(neighborhoodRecommendationList);
  const [curStep, setCurStep] = useRecoilState(curStepState);
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.BASE_URL;
  let disabled = !destination ? true : false;
  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};
  const neighborhoodButtonText = props.getNeigborhoodButtonText
  const itinPreferences = getSelectedTripPreferencesNeighborhoods(tripPreferences) + getSelectedUserPreferences(userPreferences)
  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setNeighborhoodRecommendationsArr(prev => {
      let arr:NeighborhoodRecommendation[] = [];
      return {showNeighborhoodSection: true, 
        showNeighborhoodList:true,
        neighborhoodRecommendationArray: arr };
    });
    const introPrompt = `Provide the top Neighborhoods in ${destination} for tourists to explore and how they may be able to cater to these traveler provided preferences:`;
    const endPrompt = `The AI should generate objects that includes a rating, title, and description. The rating for each neighborhood can be either "Top Match" or "Good Match" depending on compatibility. Response JSON Object Format is: {"rating": "Top Match", "title": "...", "description": "This is a great option for you because..."}; Another JSON object should follow if there are more suggestions. I will format the objects into proper JSON, only provide the objects.`;
    const generatePrompt = () => {
      if (!destination || destination === '') return '';
      return introPrompt + itinPreferences + endPrompt;
    };

    const prompt = generatePrompt();

    const response = await fetch(baseUrl + '/api/GPT/GPTRequest', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
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
    
    let properties: (keyof NeighborhoodRecommendation)[] = ['rating', 'title', 'description'];
    let propertyIndex = 0;
    let parsingString = false;
    let expectValue = false;
    let buffer = '';

    while (!done) {
      let count = 0
      count += 1
      const { value, done: doneReading } = await reader.read();
      
      done = doneReading;
      let chunkValue = decoder.decode(value);
      
      for (let i = 0; i < chunkValue.length; i++) {
        switch (chunkValue[i]) {
          case '"':
            if (parsingString) {
              // End of string found
              parsingString = false;

              if (expectValue) {
                // Clear the buffer
                buffer = '';
                // Move to the next property
                propertyIndex++;
                if (propertyIndex >= properties.length) {
                  propertyIndex = 0;
                  // We've finished an object, add a new placeholder
                }
                // Expect a property name next
                expectValue = false;
              }
            } else {
              // Start of string found
              parsingString = true;
            }
            break;
          case ':':
            // Found a colon, which means we should expect a value next
            expectValue = true;
            break;
          default:
            if (parsingString && expectValue) {
              buffer += chunkValue[i];
              if (buffer.length === 1 && expectValue && propertyIndex === 0) {
                setNeighborhoodRecommendationsArr(prev => {
                  let arr = [...(prev.neighborhoodRecommendationArray || [])];
                  arr.push({ rating: '', title: '', description: '' });
                  return {...prev, neighborhoodRecommendationArray: arr };
                });
              }
              setNeighborhoodRecommendationsArr(prev => {
                let newArray = [...(prev.neighborhoodRecommendationArray || [])]; // create a copy
                let last = newArray.length - 1;
                let obj = { ...newArray[last] }; // create a new copy of the object
                obj[properties[propertyIndex]] = buffer; // modify the copied object
                newArray[last] = obj; // replace the object in the copied array
                return {...prev,
                  neighborhoodRecommendationArray: newArray,
                };
              });
            }
            break;
        }
      }
      setUserPreferences(prev => ({...prev, showUserPreferences:false}))
      setTripPreferences(prev => ({...prev, showTripPreferences:false}))
    }
}

  return (
    <div className={styles.createItineraryButtonContainer}>
       <button className={`${styles.createItineraryButton} ${disabled ? styles.disabled : ""}`} disabled={disabled} onClick={generateResponse}>{neighborhoodButtonText}</button>
    </div>
  );
};

export default GetNeighborhoodSuggestions;

