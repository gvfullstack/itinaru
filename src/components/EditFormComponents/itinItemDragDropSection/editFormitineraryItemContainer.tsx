import React, {useEffect, useState} from "react";
import { itineraryItemsState, tripPreferencesAtom, userPreferencesAtom } from '../../../atoms/atoms';
import { useRecoilState } from 'recoil';
import styles from '../aiItinBuilderCSS/itinerary.module.css';
import { ItineraryItem } from "../editFormTypeDefs";
import EditFormDroppableItineraryContainer from './editFormDroppableItineraryContainer';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const ItineraryItemContainer: React.FC = () => {
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

  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      <EditFormDroppableItineraryContainer
          handleShowHideDescription={handleShowHideDescription}
        />
    </div>
  </DndProvider>
  );
};

export default ItineraryItemContainer;
