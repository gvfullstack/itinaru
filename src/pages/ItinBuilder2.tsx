import * as React from 'react';
import { useState } from "react";
import PageComponent from "./PageComponent";

const { v4: uuidv4 } = require('uuid');

type Meal = {
    meal: string;
    preferredTime: string;
    dietaryRestrictions: string[];
    budget: string;
}

type DefinedProps = {
    pageStep?: number;
    destination?: string;
    startTime?: Date;
    endTime?: Date;
    travelDate?: Date;
    specificSitesBool?: boolean;
    specificSites?: string[];
    excludedSites?: string[];
    pace?: number; 
    travelerCount?: number;
    ageRange?: string[];
    additionalThemes?: string[];
    neighborhoods?: string[];
    itineraryItems?: string[];
    additionalMealsBool?: boolean;
    mealItineraryItems?: string[];
    nonMealItineraryItems?: string[];
    meals?: Meal[];
    nextButtonText?: string;
    nextButton2Text?: string;
    createButtonText?: string;
    page?: string;
    introText?: string;
    infoText1?: string;
    infoText2?: string;
    prompt?: string;
    PaceOptions?: {
        pace1?: string;
        pace2?: string;
        pace3?: string;
        pace4?: string;
        pace5?: string;
        pace6?: string;
        pace7?: string;
        paceA?: number;
    };
    AgeRanges?: {
        group1?: string;
        group2?: string;
        group3?: string;
        group4?: string;
        group5?: string;
    };
    ThemeOptions?: {
        Option1?: string;
        Option2?: string;
        Option3?: string;
        Option4?: string;
        Option5?: string;
        Option6?: string;
        Option7?: string;
        Option8?: string;
        Option9?: string;
        Option10?: string;
        Option11?: string;
        Option12?: string;
        Option13?: string;
        Option14?: string;
        OptionA?: string;
    };
    
};


const ItinBuilder2 = () => {
  
  const [step, setStep] = useState<number>(1);
  const [destination, setDestination] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [travelDate, setTravelDate] = useState<Date>(new Date());
  const [specificSitesBool, setSpecificSitesBool] = useState<boolean>(false);
  const [specificSites, setSpecificSites] = useState<string[]>([]);
  const [excludedSites, setExcludedSites] = useState<string[]>([]);
  const [pace, setPace] = useState<number>(3);
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [ageRange, setAgeRange] = useState<string[]>(['ages 18 - 64']);
  const [additionalThemes, setAdditionalThemes] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [itineraryItems, setItineraryItems] = useState<string[]>([]);
  const [additionalMealsBool, setAdditionalMealsBool] = useState<boolean>(false);
  const [mealItineraryItems, setMealItineraryItems] = useState<string[]>([]);
  const [nonMealItineraryItems, setNonMealItineraryItems] = useState<string[]>([]);
  const [meals, setMeals] = useState<Meal[]>([
        {meal: "breakfast", preferredTime: "8am", dietaryRestrictions: [], budget: "less than $20"},
        {meal: "lunch", preferredTime: "12pm", dietaryRestrictions: [], budget: "less than $20"},
        {meal: "dinner", preferredTime: "6pm", dietaryRestrictions: [], budget: "less than $20"},
    ]);
  const createButtonText = "create itinerary now!";
  const pageProps: DefinedProps[]  =
      [
        {
          pageStep: 1,
          page: "10T",
          introText: "Welcome to itinerue!",
          infoText1: "We're here to help you plan your next trip.",
          infoText2: "Let's get started.",
          prompt: "Where are you going?",
          destination: destination,
          createButtonText: createButtonText,
          nextButtonText: "Lets customize!"    
        },
        {
          pageStep: 2,
          page: "20T",
          introText: "OMG!",
          infoText1: `${destination} sounds fantastic!`,
          prompt: "What is your travel date?",
          travelDate: travelDate,
          createButtonText: createButtonText,
          nextButtonText: "Lets continue!"},
        {   
          pageStep: 3,
          page: "30T",
          introText: "Cool!",
          prompt: "What times do you see your day starting and ending?",
          startTime: startTime,
          endTime: endTime,
          createButtonText: createButtonText,
          nextButtonText: "time set! Next!"},
          {   
          pageStep: 4,
          page: "40T",
          introText: "Perfect!",
          prompt: "Before I offer some suggestions, do you have any specific points of interest already in mind?",
          specificSitesBool: specificSitesBool,
          createButtonText: createButtonText,
          nextButtonText: "Oh, Yea!",
          nextButton2Text: "Not yet!"
          },
          {   
          pageStep: 5,
          page: "50T",
          introText: "Super duper!",
          prompt: "What specific sites do you want to visit?",
          specificSites: specificSites,
          createButtonText: createButtonText,
          nextButtonText: "Onward!",
          itineraryItems: itineraryItems,
        },
        {   
          pageStep:6,
          page: "60T",
          introText: "Gotcha!",
          prompt: "Um, BTW, are there any specific sites you don’t want to visit during your trip?",
          excludedSites: excludedSites,
          createButtonText: createButtonText,
          nextButtonText: "Been there, done that. Let’s go!"},
        {   
          pageStep: 7,
          page: "70T",
          introText: "No worries, I’ll make sure to exclude those!",
          infoText1: "Now I’ll ask a few questions about your preferences, so I can make appropriate recommendations.",
          prompt: "How quickly do you want to move through your itinerary/ how many sites do you want to see?",
          PaceOptions: {
              pace1: "just want to chill! (1 site)",
              pace2: "take it easy! (2 sites)",
              pace3: "no need to rush! (3 sites)",
              pace4: "pep in my step! (4 sites)",
              pace5: "let’s keep it moving! (5 sites)",
              pace6: "pick up the pace! (6 sites)",
              pace7: "let’s hustle! (7 sites)",
              paceA: 0},  //pace A is the user defined pace expressed as a number.
              pace: pace,
              createButtonText: createButtonText,
              nextButtonText: "site count set!, Next!"
          },
        {   
          pageStep: 8,
          page: "80T",
          introText: "Okay!",
          infoText1: "Now, I’d like to incorporate some information about your group to tailor your itinerary to your needs.",
          prompt: "First, how many people are traveling on this trip?",
          travelerCount: travelerCount,
          createButtonText: createButtonText,
          nextButtonText: "head count set! Next!"},
        {   
          pageStep: 9,
          page: "90T",
          introText: "Beautiful!", 
          prompt: "What age ranges should be represented in this itinerary?",
          AgeRanges: {
              group1: "ages 0 - 3",
              group2: "ages 4 - 8",
              group3: "ages 9 - 17",
              group4: "ages 18 - 64",
              group5: "ages 65+"
              },
          ageRange: ageRange,
          createButtonText: createButtonText,
          nextButtonText: "age range set! Next!"
          },
        {   
          pageStep: 10,
          page: "100T",
          introText: "Wonderful!",
          prompt: "Are there any additional themes or keywords you'd like me to consider for recommendations?",
          ThemeOptions: {
              Option1: "culture & history",
              Option2: "relaxation",
              Option3: "museums",
              Option4: "parks",
              Option5: "food and drink",
              Option6: "city exploration",
              Option7: "beaches",
              Option8: "adventure",
              Option9: "guided tours",
              Option10: "tourist attractions",
              Option11: "nature & wildlife",
              Option12: "night clubs",
              Option13: "live shows",
              Option14: "string",
              OptionA: ""}, //Option A is the user defined theme
          additionalThemes: additionalThemes,
          createButtonText: createButtonText,
          nextButtonText: "Done! Now, what?"
          },
        {   
          pageStep: 11,
          page: "110T",
          introText: "Awesome, possom!",
          infoText1: `Here are popular neighborhoods to explore in ${destination}.`, 
          infoText2: "Feel free to select a few neighborhoods to explore.",
          prompt: "Selecting fewer usually means less commute between points of interest.",
          neighborhoods: neighborhoods,
          createButtonText: createButtonText,
          nextButtonText: "to my suggestions"
          },
        {   
          pageStep:12,
          page: "120T",
          introText: "Sweet!",
          infoText1: `Here are some attractions for ${destination} that take into account the information you’ve provided so far.`,
          prompt: "Please select any you would like me to add to your itinerary!",
          nonMealItineraryItems: nonMealItineraryItems,
          mealItineraryItems: mealItineraryItems,
          createButtonText: createButtonText,
          nextButtonText: "selections complete. Lets talk meals!",
          nextButton2Text: "show more attractions!",
          itineraryItems: itineraryItems,
      },
      {   
        pageStep: 13,
        page: "140T",
        introText: "Let’s talk food!",
        infoText1: `Here are the eateries already on your itinerary so far.`,
        prompt: 'Would you like to add additional meals?',
        mealItineraryItems: mealItineraryItems,
        additionalMealsBool: additionalMealsBool,
        createButtonText: createButtonText,
        nextButtonText: "done with meals. Lets look at commuting options!",
        nextButton2Text: "lets add meals!"
      },
      {   
        pageStep: 14,
        page: "150T",
        introText: "Lets add some meals to your itinerary!",  
        prompt:"What additional meals would you like to include in your itinerary?",
        mealItineraryItems: mealItineraryItems,
        nextButtonText: "meal selection done, Next!"}, 
      {   
        pageStep: 15,
        page: "160T",
        introText: "Stupendous!",
        prompt: "Please provide details about your meal preferences.",
        meals: meals,
        createButtonText: createButtonText,
        nextButtonText:"Done! Show additional meal options"},
        { 
        pageStep: 17,
        page: "160T",
        introText: "Stupendous!",
        prompt: "Please provide details about your meal preferences.",
        meals: meals,
        createButtonText: createButtonText,
        nextButtonText:"Done! On to commuting options"},
      {   
        pageStep: 18,
        page: "170T",
        introText: "Great!",
        infoText1: "Let’s add ways to get around town.",
        infoText2:  `Here are some transportation options for ${destination}.`,
        prompt: "What’s your preferred transportation method?",
        createButtonText: createButtonText}
      ]

  const handleInputChange = (
    key: keyof UserInputs,
    value: string | number | Date
  ) => {
    setUserInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
  };

  const handleNextStep = () => {
    setUserInputs((prevState) => ({...prevState, step: prevState.step + 1}));
  };

  const handlePrevStep = () => {
    setUserInputs((prevState) => ({...prevState, step: prevState.step - 1}));
  };

  const handleCreateItinerary = () => {
    // Implement create itinerary function here
  };

  
  const handleSelectButton = (selectedValue: string) => {
    // Do something with selected value here
  };

  return (
    <>
      <h1>itinerue</h1>
          
      pageProps.map(function (props) {pageProps.introText}</>)
      { {pageProps.map((props) => (
        <React.Fragment key={uuidv4()}>
          {props && step === props.pageStep && (
            <PageComponent
              pageStep={props.pageStep}
              introText={props.introText}
              infoText1={props.infoText1}
              infoText2={props.infoText2}
              prompt={props.prompt}
              destination={props.destination}
              travelDate={props.travelDate}
              startTime={props.startTime}
              endTime={props.endTime}
              button1Text={props.button1Text}
              button2Text={props.button2Text}
            />
          )} }
        </React.Fragment>
      ))}
  
      <button onClick={handlePrevStep}>Back</button>
    </>
  );
          }
export default ItinBuilder2;