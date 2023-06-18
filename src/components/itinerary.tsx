import React, {useEffect} from "react";
import { itineraryItemsState, tripPreferencesAtom } from '../../src/atoms/atoms';
import { useRecoilState } from 'recoil';
import styles from '../components/itinBuilderCSS/itinerary.module.css';
import { ItineraryItem } from "./typeDefs";
import DraggableItineraryItem from './draggableItineraryItem';
import DroppableItineraryContainer from './droppableItineraryContainer';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Itinerary: React.FC = () => {
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.viator.com/orion/partner/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const buttonElements = document.querySelectorAll('.button__3DBl');

    buttonElements.forEach((buttonElement) => {
      const productDetailsWrapper = buttonElement.closest('.productDetailsWrapper__1dmV');
      if (productDetailsWrapper) {
        const titleElement = productDetailsWrapper.querySelector('.title__2bJD');
        if (titleElement) {
          const title = titleElement.textContent;
          buttonElement.textContent = 'Book Now/Add to Itinerary';

          buttonElement.addEventListener('click', (event) => {
            const newItineraryItem = {
              siteName: title || "",
              startTime: { time: new Date(travelDate), beingEdited: false },
              endTime: { time: new Date(travelDate), beingEdited: false },
              description: "",
              locationAddress: "",
              locationWebsite: "",
              expectedPerPersonBudget: "",
              descHidden: false,
              id: "",
              averageWeatherOnTravelDate: "",
              activityDuration: 0,
              userDefinedRespectedTime: false,
              activityType: "",
              // fill out other properties as needed
            };
            setItineraryItems((prevItinerary) => [...prevItinerary, newItineraryItem]);
          });
        }
      }
    });
  }, []);

  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      <div className={styles.utilitySection}>
        <button className={styles.shareItineraryButton}>share</button>
        <button className={styles.addItineraryItemButton}>+</button>
      </div>
      <p>
        {`My trip to ${destination} on ${formattedTravelDate}`}
      </p>
        <DroppableItineraryContainer
          handleShowHideDescription={handleShowHideDescription}
        />
        <div 
          data-vi-partner-id="P00107668" 
          data-vi-widget-ref="W-8277e1bf-c7b3-4515-a7e8-db4561cf6a8a"
        />  
    </div>
    
  </DndProvider>
  );
};

export default Itinerary;
