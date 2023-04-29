import React  from "react";
import { useState, useEffect } from "react";
import styles from "./itinBuilderCSS/welcomeText.module.css";
import { useRecoilState } from "recoil";
import { DefinedProps } from "@/typeDefs";

interface IntroObject {
  [key: string]: Array<{ message: string }> | undefined;
}

const WelcomeText: React.FC<DefinedProps> = (props) => {
  const pageStep = props.pageStep ?? "10T";
  const [displayedIntroMessage, setDisplayedIntroMessage] = useState("");

  
  const introText = [
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
    {"20T":
      [
      {message: "OMG, I'm so excited for you! What is your travel date?"},
      {message: "Adventure awaits! When are you setting sail?"},
      {message: "Oh la la! When do you plan to embark on this journey?"},
      {message: "Time to pack those bags! What's the departure date?"},
      {message: "Bon voyage! When are you taking off to your destination?"},
      {message: "Wanderlust mode: ON! When does your epic trip begin?"},
      {message: "Globetrotter in the making! What's your travel date?"},
      {message: "All aboard! When do we start this fantastic voyage?"},
      {message: "Explorers unite! When are you jetting off to your next adventure?"},
      {message: "A journey of a thousand miles begins with a single step... and a travel date! When's yours?"},
      {message: "Time flies when you're having fun! When does your adventure take flight?"},
      {message: "Pack your bags and grab your passport! When's your travel date?"},
      {message: "The world is your oyster! When are you diving in?"},
      {message: "Can't wait to hear about your trip! When are you leaving?"},
      {message: "Ready, set, travel! When's your departure date?"},
      {message: "Get your camera ready! When are you capturing memories in a new place?"},
      {message: "New horizons await! When's your journey starting?"},
      {message: "Adventure is calling! When are you answering the call?"},
      {message: "The world's a stage, and you're about to make your entrance! When's showtime?"}
      ]
    },
    {"30T":
    [
      {message: "What are the start and end times?"},
      {message: "Time to get this party started! When does it begin and end?"},
      {message: "Let's synchronize our watches! What are the start and end times?"},
      {message: "Tick-tock, tick-tock! When's the fun beginning and when's it wrapping up?"},
      {message: "From dawn to dusk or something in between? When are your start and end times?"},
      {message: "It's a race against the clock! What are your start and end times?"},
      {message: "Time flies when you're having fun! When does your event kick off and wind down?"},
      {message: "All good things must come to an end... eventually! What are the start and end times?"},
      {message: "Let's make every second count! When do your festivities commence and conclude?"},
      {message: "Time is of the essence! What are the start and end times for your event?"},
      {message: "The early bird catches the worm! When does your event start and finish?"},
      {message: "Carpe Diem! What are your start and end times for seizing the day?"},
      {message: "No time like the present! When are your event's start and end times?"},
      {message: "Are we there yet? When do your start and end times roll around?"},
      {message: "What's the ETA for your event's beginning and end?"},
      {message: "The clock is ticking! When do your event's hands start and stop moving?"},
      {message: "From zero to hero! When does your event start and reach its grand finale?"},
      {message: "Don't let time slip away! What are the start and end times for your event?"},
      {message: "Let's not be fashionably late! When are the start and end times?"},
      {message: "In the words of the White Rabbit, 'I'm late, I'm late!' When are your start and end times?"},{message: "Seize the day and don't delay! When do your event's start and end times fall?"},
      {message: "Make the most of each moment! What are your start and end times for this special day?"},
      {message: "Time to embrace the day! When does your event start and finish?"},
      {message: "Let's capture the essence of the day! What are the start and end times?"},
      {message: "No time to waste – seize the day! What are your start and end times?"},
      {message: "Living life to the fullest! What are the start and end times for your event?"},
      {message: "Make every moment count! When do your start and end times occur?"},
      {message: "Let's make today extraordinary! What are the start and end times for your event?"}
      ]
    },
    {"40T":
    [
      {message: "What is your desired per person budget?"},
      {message: "How much are you looking to spend per person on this fantastic adventure?"},
      {message: "We want to tailor your trip just right! What's the ideal per person budget?"},
      {message: "Let's create the perfect itinerary! What is your target budget per person?"},
      {message: "From budget-friendly to luxury, we've got you covered! What's your desired per person budget?"},
      {message: "Everyone has a travel style! What is the per person budget you have in mind?"},
      {message: "A trip tailored to your wallet! What is your preferred per person budget?"},
      {message: "Time to create your dream trip! What's your desired budget per traveler?"},
      {message: "We want to make sure your trip fits your budget! What is your ideal per person spending limit?"},
      {message: "Let's plan a trip that won't break the bank! What's your desired per person budget?"},
      {message: "Tell us your budget, and we'll make it work! What is your desired per person spending limit?"},
      {message: "Let's customize your trip to fit your budget! What's the per person price range you have in mind?"},
      {message: "Time to talk numbers! What's your target budget per person for this unforgettable journey?"},
      {message: "Every traveler has a budget in mind! What's your desired per person spending for this trip?"},
      {message: "Budget-friendly or splurge-worthy, we can do it all! What's your ideal per person budget?"},
      {message: "We want to create the perfect trip within your budget! What's your preferred per person spending limit?"},
      {message: "Let's make sure your trip is budget-friendly! What is your desired per person budget for this adventure?"},
      {message: "A trip that's perfect for your wallet! What is your target per person budget for this journey?"},
      {message: "Let's plan a trip that suits your budget! What's your preferred spending limit per person?"},
      {message: "We'll help you get the most bang for your buck! What's your desired budget per traveler?"},
      {message: "Creating a trip that fits your budget! What is your ideal per person spending range?"},
      {message: "Tell us your budget, and we'll create a trip to match! What's your desired per person spending limit?"},
      {message: "We want to make sure your trip is just right! What's your target budget per person?"},
      {message: "Let's craft a trip that fits your financial plans! What is your preferred per person budget?"},
      {message: "From budget adventures to luxury experiences, we can do it all! What's your ideal per person budget?"},
      {message: "No matter your budget, we'll plan a fantastic trip! What's your desired spending limit per person?"},
      {message: "Let's make your dream trip a reality within your budget! What's your preferred per person spending range?"},
      {message: "Creating a personalized trip that suits your budget! What is your target per person budget for this journey?"}
      ]
    },
    {"50T":
    [
    {message: "Ooh, any must-see spots on your travel bucket list?"},
    {message: "Let's create the ultimate itinerary! What locations should we definitely include?"},
    {message: "Time to be your own tour guide! What are your top picks for must-visit locations?"},
    {message: "Let's make this trip one for the books! What are some must-see locations on your list?"},
    {message: "Ready to make some memories? What iconic spots do you want to check off your list?"},
    {message: "Show me the way to the next cool spot! What destinations are on your wishlist?"},
    {message: "Ready to conquer the map? What must-visit spots are on your radar?"},
    {message: "Planning the ultimate getaway! What specific locations should we sprinkle in?"},
    {message: "Let's create some postcard-worthy moments! What are your must see spots?"},
    {message: "Every great journey has a few stops along the way! What are your must-see locations?"},
    {message: "Let's go where the wind takes us! What must-see locations are calling your name?"},
    {message: "The journey of a lifetime awaits! What epic spots should we make sure to include?"},
    {message: "We're in this together! What must-see spots should we add to our list?"},
    {message: "It takes two to tango! What amazing destinations are on your bucket list?"},
    {message: "Let's combine our travel powers! What top-notch locations should we absolutely visit?"},
    {message: "What a dynamic duo we make! What must-visit locations should we add to our itinerary?"},
    {message: "We're better together! What incredible spots do you think we should explore?"},
    {message: "Two heads are better than one! What fantastic locations should we be sure to visit?"},
    {message: "United we travel! What awe-inspiring locations do you want to make sure to visit?"}
    
    ]
  },
  {"60T":
  [
    {message: "Um, BTW, are there any specific sites we should exclude from your itinerary i.e. too boring, already seen, etc.?"},
    {message: "Let's skip the snooze-fests! Any places you'd like to avoid on your trip?"},
    {message: "No time for yawns! Are there any locations we should definitely leave off the list?"},
    {message: "Been there, done that! Any spots you've already checked off and don't want to revisit?"},
    {message: "No tourist traps allowed! Are there any places we should steer clear of on this journey?"},
    {message: "Quality over quantity! What locations should we ditch to keep the fun levels high?"},
    {message: "Dodging the duds! Are there any places we should avoid to keep the excitement rolling?"},
    {message: "Let's keep this trip fresh! What locations have you already seen and don't want to include?"},
    {message: "No time-wasters, please! What spots should we exclude to make the most of your trip?"},
    {message: "We want only the best for you! Are there any locations you'd rather not visit this time?"},
    {message: "Adventure awaits, but so do some avoidable spots! What places should we leave out?"},
    {message: "You deserve a top-notch trip! What less-than-stellar spots should we avoid?"},
    {message: "Ain't nobody got time for that! What locations are just not worth including?"},
    {message: "Let's dodge those déjà vu moments! What places have you seen enough of already?"},
    {message: "No filler, all thriller! What locations should we nix to keep your trip action-packed?"},
    {message: "No humdrum spots allowed! What locations should we skip to keep the good times rolling?"},
    {message: "We're aiming for the moon! What spots should we exclude to reach for the stars?"},
    {message: "You're the star of this show, so what locations should we cut from the script?"},
    {message: "Not all that glitters is gold! What locations should we avoid to keep your trip shining bright?"},
    {message: "Let's keep this party poppin'! What places should we drop from your itinerary?"},
    {message: "We're all about good vibes! What locations should we avoid to keep your trip groovy?"},
    {message: "No time for dull moments! What spots should we bypass to keep your adventure electrifying?"},
    {message: "You deserve the best of the best! What locations just don't make the cut?"},
    {message: "We're curating the perfect trip! What places should we omit to keep it top-tier?"},
    {message: "No detours needed! What locations should we avoid to keep your journey on point?"},
    {message: "Time to focus on the highlights! What spots should we leave out to keep your trip dazzling?"}
    ]
  },
  {"70T":
    [{message: "How quickly do you want to move through your itinerary/ how many sites do you want to see?"},
    {message: "Ready, set, go! What's your pace for this adventure, and how many stops are you aiming for?"},
    {message: "On your marks, get set... How many sites are you planning to visit, and at what speed?"},
    {message: "Full speed ahead or leisurely strolling? How many sites do you want to visit, and how fast?"},
    {message: "The need for speed (or not)! How many sites do you want to explore, and how quickly?"},
    {message: "Zoom, zoom! What's your pace for this trip, and how many places are you looking to visit?"},
    {message: "Slow and steady or swift as the wind? How many sites are on your wishlist, and at what pace?"},
    {message: "Time's a-tickin'! How many stops do you want to make, and how quickly do you want to move?"},
    {message: "Let's find your perfect pace! How many locations are you hoping to visit, and how fast?"},
    {message: "Like a whirlwind or a gentle breeze? How many sites are on your list, and what's your pace?"},
    {message: "Adventure awaits! How many stops do you want to make, and how quickly will you move through them?"},
    {message: "Finding your rhythm! How many sites do you want to see, and at what tempo?"},
    {message: "Time to get moving! How many locations are you hoping to visit, and at what speed?"},
    {message: "Pace yourself, traveler! How many sites do you want to explore, and how quickly?"},
    {message: "No time to lose (or maybe there is)! How many sites do you want to see, and what's your pace?"},
    {message: "Pick up the pace or take it slow? How many sites are you aiming for, and at what speed?"},
    {message: "The world is waiting! How many stops are on your list, and how quickly do you want to move?"},
    {message: "Fast and furious or slow and steady? How many sites do you want to visit, and at what pace?"},
    {message: "Ready for a sprint or a marathon? How many sites do you want to see, and how fast?"},
    {message: "Time to make every moment count! How many locations are you planning to visit, and at what pace?"},
    {message: "The race is on (or not)! How many sites do you want to check out, and how quickly?"},
    {message: "Pedal to the metal or taking it easy? How many stops do you want to make, and at what pace?"},
    {message: "Let's map out your adventure! How many sites do you want to visit, and how fast will you go?"},
    {message: "No time like the present! How many stops are on your itinerary, and how quickly do you want to move?"},
    {message: "Hop, skip, or jump? How many sites do you want to see, and at what speed?"},
    {message: "Rev up your engines! How many locations are you hoping to explore, and how quickly?"},
    {message: "Time to seize the day! How many sites are on your list, and what's your pace?"}
    ]
  },
  {"80T":
  [
    {message: "How many people are traveling on this trip?"},
    {message: "Let's get a headcount! How many travelers are embarking on this amazing journey, including you?"},
    {message: "No matter the size of your party, every adventure is unique! How many people are traveling in total?"},
    {message: "Solo or with company, the excitement awaits! What's the total number of travelers on this trip?"},
    {message: "Time to gather your travel team! How many people, yourself included, will be on this adventure?"},
    {message: "Whether it's just you or a whole crew, every trip is special! How many travelers in total?"},
    {message: "Every journey has its own charm! What's the total number of people traveling, including yourself?"},
    {message: "One or many, the world is ready for you! How many travelers are there in total, counting yourself?"},
    {message: "No matter who's coming along, the adventure awaits! What's the total number of travelers?"},
    {message: "Time for some fun! How many people in total, including yourself, will be traveling on this trip?"},
    {message: "The world is your playground! How many travelers, including yourself, are setting off on this journey?"},
    {message: "A journey to remember! What's the total headcount of travelers for this trip, including yourself?"},
    {message: "All set for a fantastic time? How many travelers are there in total, counting you as well?"},
    {message: "Ready to explore? How many people, yourself included, will be part of this unforgettable trip?"},
    {message: "Let's create some amazing memories! What's the total number of travelers, including you?"},
    {message: "From solo travelers to big groups, every adventure counts! How many people are traveling in total?"},
    {message: "The excitement is building! How many travelers are there in total, counting yourself as well?"},
    {message: "Your adventure is about to begin! How many people, including you, will be traveling on this trip?"},
    {message: "The journey awaits! What's the total number of travelers for this trip, including yourself?"},
    {message: "Every traveler makes a difference! How many people in total, yourself included, will be on this journey?"},
    {message: "Ready for takeoff? What's the total headcount of people traveling on this trip, including you?"},
    {message: "Let's embark on this amazing adventure! How many travelers are there in total, counting you as well?"},
    {message: "Set your sights on new horizons! How many people, yourself included, will be traveling on this trip?"},
    {message: "Time to hit the road! What's the total number of travelers, including yourself, for this adventure?"},
    {message: "No matter the group size, adventure awaits! How many people are traveling in total, including you?"},
    {message: "Solo or with others, every trip is an opportunity! How many travelers in total, counting yourself?"},
    {message: "Let's get ready for an amazing trip! How many people, including you, will be traveling on this journey?"},
    {message: "Ready for new experiences? What's the total number of travelers for this trip, including yourself?"},
    {message: "Pack your bags and count your travel buddies! How many travelers are there in total, yourself included?"}
    ]
  },
  {"90T":
  [ 
    {message: "What age ranges should be represented in this itinerary?"},
    {message: "From young to old, we've got you covered! What age ranges should we cater to in your travel plans?"},
    {message: "Travel is for everyone! Which age groups should we keep in mind while planning your itinerary?"},
    {message: "Making memories for all ages! What age ranges should we consider when creating your trip?"},
    {message: "Fun for the whole family or an adults-only adventure? What age ranges should we accommodate in the itinerary?"},
    {message: "Let's create a trip that's perfect for everyone! What age ranges should we consider for your itinerary?"},
    {message: "We want your trip to be a perfect fit! What age ranges should we include in the planning process?"},
    {message: "To ensure the best experience, what age ranges should we focus on when designing your itinerary?"},
    {message: "A great journey for all! Which age groups should we take into consideration when planning your trip?"},
    {message: "Time to create a trip that suits everyone! What age ranges should we cater to in your travel plans?"},
    {message: "Let's make your trip enjoyable for everyone! Which age ranges should we consider for your itinerary?"},
    {message: "Creating memories for all generations! What age groups should we keep in mind while planning your trip?"},
    {message: "Travel transcends age! What age ranges should we accommodate when crafting your perfect itinerary?"},
    {message: "An adventure for every age! Which age groups should we focus on when putting together your trip?"},
    {message: "From tots to seniors, we've got it covered! What age ranges should we include in your personalized itinerary?"},
    {message: "Age-appropriate fun for everyone! What age groups should we consider while planning your amazing journey?"},
    {message: "Let's plan a trip that's perfect for all ages! What age ranges should we bear in mind for your itinerary?"},
    {message: "No age left behind! What age ranges should we take into account when planning your travel itinerary?"},
    {message: "Creating an age-friendly itinerary! Which age groups should we keep in mind when planning your trip?"},
    {message: "Tailoring the perfect trip for every age! What age ranges should we consider in your travel plans?"},
    {message: "Every age deserves an adventure! What age groups should we include when creating your itinerary?"},
    {message: "A trip to remember for all ages! Which age ranges should we take into consideration for your journey?"},
    {message: "Making your journey enjoyable for all! What age ranges should we focus on while planning your trip?"},
    {message: "Let's create a trip that suits everyone's needs! What age ranges should we consider for your itinerary?"},
    {message: "Time to plan an age-appropriate adventure! What age groups should we keep in mind for your travel plans?"},
    {message: "Ensuring a memorable trip for all ages! What age ranges should we accommodate in your itinerary?"},
    {message: "Customizing your journey for every age! Which age groups should we focus on when planning your trip?"},
    {message: "Let's plan a trip that's perfect for every age! What age ranges should we consider when creating your itinerary?"}
  ] 
  },
  {"100T":
  [
    {message: "What theme(s) or keyword(s) describe the trip you want to take?"}
  ]
  },
  {"110T":
  [ 
    {
      message: "Totally optional, but here are some popular neighborhoods you can select that can accommodate your preferences. Staying within a few neighborhoods sometimes means less time commuting and more time enjoying the day."
      },
      {
      message: "Just so you know, we've handpicked a list of neighborhoods based on your preferences. Feel free to select a few for a more tailored experience, or skip if you'd like to explore freely!"
      },
      {
      message: "Based on your input, we've curated a list of neighborhoods that match your interests. Choosing a few will streamline your experience, but it's not mandatory. Happy exploring!"
      },
      {
      message: "Good news! We've got a selection of neighborhoods that align with your preferences. Picking a few will help you maximize your time, but it's completely up to you!"
      },
      {
      message: "Hey there! We have a customized list of neighborhoods that cater to your tastes. You can select some to focus your visit, but no pressure if you prefer to keep things open-ended."
      },
      {
      message: "We've prepared a list of neighborhoods that suit your preferences! While choosing a few may lead to a more efficient trip, remember that it's entirely optional."
      },
      {
      message: "Exciting update: We've identified neighborhoods that fit your interests! Selecting some can enhance your experience, but feel free to skip this step if you'd rather explore without limits."
      },
      {
      message: "Heads up! We've got a collection of neighborhoods tailored to your preferences. Picking a few can save you time and energy, but the choice is yours!"
      },
      {
      message: "Based on your details, we've compiled a list of neighborhoods that cater to your needs. While selecting a few can optimize your trip, don't worry if you'd rather keep your options open."
      },
      {
      message: "We've gathered a list of neighborhoods that should align with your interests! Opting for a few can help streamline your visit, but there's no obligation to choose any if you prefer a more spontaneous adventure."
      },
      {
      message: "By the way, we've put together a selection of neighborhoods that match your criteria! Picking a few will allow you to focus your time, but skipping this step is also perfectly fine."
      },
      {
      message: "FYI, we've curated a list of neighborhoods just for you based on your preferences! Choosing some will enable a more targeted experience, but remember, it's not a requirement."
      },
      {
      message: "Friendly reminder: We have a list of neighborhoods that suit your tastes! Selecting a few can result in a more efficient journey, but it's not necessary if you'd rather keep things flexible."
      },
      {
      message: "We've created a list of neighborhoods that align with your interests! Opting for a few can help you make the most of your time, but it's your call if you prefer not to make a selection."
      },
      {
      message: "Attention, traveler! We have a tailored list of neighborhoods that match your preferences. Feel free to pick a few for a more focused adventure, or skip this step if you'd rather explore without restrictions."
      },
      {
      message: "Quick update: We've assembled a list of neighborhoods based on your input! Choosing a few can lead to a more streamlined trip, but don't fret if you'd rather leave things open-ended."
      }
  ]
  },
                                                       
  // ARR of objects  
  ]

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
  }, []);



  return (
    <div className={styles.welcomeTextContainer}>
      
      <p className={styles.introText}>
        {displayedIntroMessage}
      </p>
     
    </div>
  );
};

export default WelcomeText;

