import React, { useRef, useState, useEffect } from "react";
import { ItineraryItem } from "./typeDefs";
import { useDrop } from "react-dnd";
import DraggableItineraryItem from "./draggableItineraryItem";
import styles from "../components/itinBuilderCSS/itinerary.module.css";
import { useRecoilState, atom } from "recoil";
import { itineraryItemsState, tripPreferencesAtom } from "../atoms/atoms";


interface DroppableItineraryContainerProps {
  handleShowHideDescription: (curItineraryItem: ItineraryItem) => void;
}


const DroppableItineraryContainer: React.FC<DroppableItineraryContainerProps> = ({
  handleShowHideDescription
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);
  const [tripPreferences, setTravelPreferences] = useRecoilState(tripPreferencesAtom);
  const travelDate = tripPreferences.travelDate ?? new Date();

  const dropIndexRef = useRef<number | null>(null);

  const [, drop] = useDrop(() => ({
    accept: "itineraryItem",
    hover: (item, monitor) => {
      if (!ref.current) return;

      const draggedItem = monitor.getItem() as ItineraryItem;
      const draggedItemIndex = itineraryItems.findIndex(
        (i) => i.id === draggedItem.id
      );

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      let newDropIndex: number | null = null;
      for (let i = 0; i < itineraryItems.length; i++) {
        if (i === draggedItemIndex) continue;
        const itemY =
          (hoverBoundingRect.height / itineraryItems.length) * i;
        const itemHeight = hoverBoundingRect.height / itineraryItems.length;
        if (hoverClientY < itemY + itemHeight / 2) {
          newDropIndex = i;
          break;
        }
      }
      if (newDropIndex === null) {
        newDropIndex = itineraryItems.length - 1;
      }
      dropIndexRef.current = newDropIndex;
    },

    drop: (item, monitor) => {
      if (dropIndexRef.current === null) return;

      const draggedItemIndex = itineraryItems.findIndex(
        (item) => item.id === (monitor.getItem() as ItineraryItem).id
      );
      const newOrderedItems = [...itineraryItems];
      const draggedItem = newOrderedItems.splice(draggedItemIndex, 1)[0];
      console.log("draggedItem", draggedItem)
      newOrderedItems.splice(dropIndexRef.current, 0, draggedItem);
      const updatedItemsWithNewTimes = updateStartTimes(newOrderedItems, draggedItem); //steps out to update start times
      setItineraryItems(updatedItemsWithNewTimes);
    },
  }));
////////////////////////////////////////////update start times
  const updateStartTimes = (items: ItineraryItem[], draggedItem: ItineraryItem) => {
    const updatedItems = [...items];
    const dayStartTime = new Date(travelDate);
  
    if (itineraryItems[0]?.startTime?.time) {
      const firstItemTime = new Date(itineraryItems[0].startTime.time);
      dayStartTime.setHours(firstItemTime.getHours());
      dayStartTime.setMinutes(firstItemTime.getMinutes());
    }
    
    for (let i = 0; i < updatedItems.length; i++) {
      const previousEndTime = i === 0 ? undefined: new Date(
        travelDate.getFullYear(),
        travelDate.getMonth(),
        travelDate.getDate(),
        updatedItems[i-1].endTime?.time?.getHours() || 0,
        updatedItems[i-1].endTime?.time?.getMinutes() || 0);
      const currentItemDuration = updatedItems[i].activityDuration || 0;
      let userDefinedRespectedTime = updatedItems[i].userDefinedRespectedTime;

      let newStartTime; 
   
     if(updatedItems[i].id === draggedItem.id && updatedItems[i].userDefinedRespectedTime === true)
      {
        userDefinedRespectedTime = false
      }
    
    if (i === 0 && updatedItems[i].userDefinedRespectedTime === false) {
        newStartTime = dayStartTime;
    } else if (updatedItems[i].userDefinedRespectedTime === true) {
        newStartTime = new Date(
        travelDate.getFullYear(),
        travelDate.getMonth(),
        travelDate.getDate(),
        updatedItems[i].startTime?.time?.getHours() || 0,
        updatedItems[i].startTime?.time?.getMinutes() || 0
      )
    } else {
        newStartTime = previousEndTime;
    }
      
      const newEndTime = newStartTime ? new Date(newStartTime.getTime() + currentItemDuration): updatedItems[i].endTime?.time;


      updatedItems[i] = {
        ...updatedItems[i],
        userDefinedRespectedTime: userDefinedRespectedTime,
        startTime: {...updatedItems[i].startTime, time: newStartTime, beingEdited: updatedItems[i].startTime?.beingEdited ?? false}, 
        endTime: {...updatedItems[i].startTime, time: newEndTime, beingEdited: updatedItems[i].endTime?.beingEdited ?? false}
      };
    }
    return updatedItems;
  };

  drop(ref);

  return (
    <div ref={ref} className={styles.parentDropDiv}>
      {itineraryItems.map((itineraryItem: ItineraryItem) => (
        <DraggableItineraryItem
          key={itineraryItem.id}
          id={itineraryItem.id || "default-id"} // Provide a default value here
          itineraryItem={itineraryItem}
          handleShowHideDescription={handleShowHideDescription}
        />
      ))}
    </div>
  );
};

export default DroppableItineraryContainer;
