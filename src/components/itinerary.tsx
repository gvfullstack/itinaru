import React from "react";
import { itineraryItemsState } from '../../src/atoms/atoms';
import { useRecoilState } from 'recoil';
import styles from '../components/itinBuilderCSS/itinerary.module.css';
import { ItineraryItem } from "../typeDefs";
import DraggableItineraryItem from './draggableItineraryItem';
import DroppableItineraryContainer from './droppableItineraryContainer';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Itinerary: React.FC = () => {
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);

  const handleShowHideDescription = (curItineraryItem: ItineraryItem) => {
    setItineraryItems(prevState => {
      const updatedNeighborhoods = prevState.map((itineraryItem) => {
        if(curItineraryItem.venue === itineraryItem.venue) {
          return {...itineraryItem, descHidden: !itineraryItem.descHidden}
        }
        else {       
          return itineraryItem}
      })
      return updatedNeighborhoods;
    });
  };

  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      <div className={styles.utilitySection}>
        <button className={styles.shareItineraryButton}>share</button>
        <button className={styles.addItineraryItemButton}>+</button>
      </div>
        <DroppableItineraryContainer
          handleShowHideDescription={handleShowHideDescription}
        />
    </div>
  </DndProvider>
  );
};

export default Itinerary;
