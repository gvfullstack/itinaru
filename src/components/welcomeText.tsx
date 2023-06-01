import React  from "react";
import { useState, useEffect, useMemo } from "react";
import styles from "./itinBuilderCSS/welcomeText.module.css";
import { useRecoilState } from "recoil";
import { DefinedProps } from "@/components/typeDefs";

interface IntroObject {
  [key: string]: Array<{ message: string }> | undefined;
}

const WelcomeText: React.FC<DefinedProps> = (props) => {
  const pageStep = props.pageStep ?? "10T";
  const [displayedIntroMessage, setDisplayedIntroMessage] = useState("");

  
  const introText = useMemo(() => [
  // ARR of objects  
    {"10T":
    [
      {message: "Hello fellow traveler! Let's put the 'u' in itinaru by planning your perfect trip! Where are you traveling to?"},
      {
        message: "Greetings! Let's get started on planning the perfect trip for you! What's your destination?"
      },
      {
        message: "Welcome to your personal trip planner! Where are you off to next?"
      },
      {
        message: "Hello and welcome! Let's create an amazing travel itinerary for you! What's your destination?"
      },
      {
        message: "Hey there! Ready to plan an unforgettable trip? Where are you headed?"
      },
      {
        message: "Hey, fellow adventurer! Let's plan a trip you'll never forget! Where are you going?"
      },
      {
        message: "Greetings, and welcome to your travel planning companion! Where are you traveling to next?"
      },
      {
        message: "Hello, and let's plan a trip you'll always remember! What's your destination?"
      },
      {
        message: "Hi there! Ready to plan your perfect trip? Where are you headed?"
      },
      {
        message: "Welcome! Let's plan an unforgettable trip together! What's your destination?"
      },
      {
        message: "Hey, traveler! I'm excited to help you plan your next adventure! Where are you traveling to?"
      },
      {
        message: "Hello, and welcome to your personal travel guide! What's your next destination?"
      }
      
    ]},
    
                                                       
  // ARR of objects  
  ], [])

  useEffect(() => {
    const displayIntroMessage = (pageStep: string) => {
      let message: string = "";
      const pageIntro: IntroObject = introText.find(intro => intro.hasOwnProperty(pageStep)) ??
        { "nullMessage": [{ message: `No intro text found for page ${pageStep}.` }] };

      if ('nullMessage' in pageIntro) {
        const messages = pageIntro.nullMessage ?? [{ message: `No intro text found for page ${pageStep}.` }];
        return message = messages[Math.floor(Math.random() * messages.length)].message;
      } else {
        const messages = pageIntro[pageStep] ?? [{ message: `No intro text found for page ${pageStep}.` }];
        return message = messages[Math.floor(Math.random() * messages.length)].message;
      }
    };

    setDisplayedIntroMessage(displayIntroMessage(pageStep));
  }, [pageStep, introText]);



  return (
    <div className={styles.welcomeTextContainer}>
      
      <p className={styles.introText}>
        {displayedIntroMessage}
      </p>
     
    </div>
  );
};

export default WelcomeText;

