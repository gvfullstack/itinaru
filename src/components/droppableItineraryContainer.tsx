import React, { useRef, useState, useEffect, useCallback } from "react";
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
  const itineraryItemsRef = useRef(itineraryItems);
  useEffect(() => {
    itineraryItemsRef.current = itineraryItems;
  }, [itineraryItems]);

  const dropIndexRef = useRef<number | null>(null);
  const [localNewDropIndex, setLocalNewDropIndex] = useState<number | null>(null)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
  const dragDirection = draggedItemIndex && localNewDropIndex && draggedItemIndex >= localNewDropIndex ? true : false

  const [, drop] = useDrop(() => ({
    accept: "itineraryItem",
    hover: (item, monitor) => {
      if (!ref.current) return;
      const draggedItem = monitor.getItem() as ItineraryItem;  
      for (let i = 0; i < itineraryItemsRef.current.length; i++) {
        const item = itineraryItemsRef.current[i];      
        if (item.id === draggedItem.id) {
          setDraggedItemIndex(i);
          break;
        }
      }   
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      let newDropIndex: number | null = null;
      for(let index = 0; index < itemRefs.current.length; index++) {
        const item = itemRefs.current[index]??undefined;
        if (item.ref !== null) {
        const hoverBoundingRect = item.ref.getBoundingClientRect()??undefined;
        if (hoverBoundingRect.top <= clientOffset.y && hoverBoundingRect.bottom > clientOffset.y) {
          setLocalNewDropIndex(index)
          newDropIndex = index;
          break; // stop the loop as soon as we find a match
        }
      }
      }

      if (newDropIndex === null) {
        newDropIndex = itineraryItemsRef.current.length - 1;
      }
      dropIndexRef.current = newDropIndex;
    },

///////************************************************************************* */
    
    drop: (item, monitor) => {
      setLocalNewDropIndex(null)
      const draggedItem = monitor.getItem() as ItineraryItem;
      let draggedItemIndex = -1;
      for (let i = 0; i < itineraryItemsRef.current.length; i++) {
        const item = itineraryItemsRef.current[i];      
        if (item.id === draggedItem.id) {
          draggedItemIndex = i;
          break;
        }
      }

      if (draggedItemIndex < 0) return;
      const newOrderedItems = itineraryItemsRef.current.filter((item, index) => index !== draggedItemIndex);
      const updatedOrderedItems = [...newOrderedItems];
      const indexToUse = dropIndexRef.current !== null && dropIndexRef.current !== undefined ? dropIndexRef.current : draggedItemIndex;
      updatedOrderedItems.splice(indexToUse, 0, draggedItem);
      const updatedItemsWithNewTimes = updateStartTimes(updatedOrderedItems, draggedItem); //steps out to update start times
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
  type ItemRefType = { id: string | undefined, ref: HTMLDivElement | null };
  const itemRefs = useRef<ItemRefType[]>([]);
  const getItemRef = useCallback((node: HTMLDivElement | null, itemId?: string) => {
    if (node !== null && itemId) {
      const index = itemRefs.current.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        itemRefs.current[index].ref = node;
      } else {
        itemRefs.current.push({ id: itemId, ref: node });
      }
    }
  }, []);
    
  useEffect(() => {
    itemRefs.current = itineraryItems.map(itineraryItem => {
      const ref = itemRefs.current.find((itemRef) => itemRef.id === itineraryItem.id);
      return ref || { id: itineraryItem.id, ref: null };    });
    }, [itineraryItems]); 
  
    return (
      <div ref={ref} className={styles.parentDropDiv}>
        {itineraryItems.map((itineraryItem: ItineraryItem, index: number) => {
          const isDraggedDownward = !dragDirection;
          const isDraggedUpward = dragDirection;
          const isHovered = localNewDropIndex === index && draggedItemIndex !== index;
          
          return (
            <DraggableItineraryItem
              key={itineraryItem.id}
              id={itineraryItem.id || "default-id"} // Provide a default value here
              itineraryItem={itineraryItem}
              handleShowHideDescription={handleShowHideDescription}
              ref={(node) => getItemRef(node, itineraryItem.id)}
              style={{                
                borderBottom: isDraggedDownward && isHovered ? '1px solid #000' : 'none',
                borderTop: isDraggedUpward && isHovered ? '1px solid #000' : 'none',
                paddingBottom: isHovered && isDraggedDownward ? '3rem' : '0',
                paddingTop: isHovered && isDraggedUpward ? '3rem' : '0',

                transition: 'transform 3s ease',
              }}
            />
          );
        })}
      </div>
    );
}    

export default DroppableItineraryContainer;
