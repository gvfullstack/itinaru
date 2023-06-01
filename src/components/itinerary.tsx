import React from "react";
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
        if(curItineraryItem.activityTitle === itineraryItem.activityTitle) {
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
      : "";  const travelDate = new Date(tripPreferences.travelDate??"");

  const formattedTravelDate = travelDate.toLocaleDateString("en-US", {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

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
    </div>
  </DndProvider>
  );
};

export default Itinerary;
