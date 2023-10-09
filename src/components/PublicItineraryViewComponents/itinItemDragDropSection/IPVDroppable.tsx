import React, { useRef, useState, useEffect, useCallback } from "react";
import { ItineraryItem, ItineraryItems, Itinerary } from "../publicItinViewTypeDefs";
import { useDrop } from "react-dnd";
import IPVDraggable from "./IPVDraggable";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentlyViewingItineraryState } from "../publicItinViewAtoms";
import styles from'./dragDrop.module.css'
import dayjs from 'dayjs';


const IPVDroppable: React.FC = () => {
    const [itineraryItemsState, setItineraryItemsState]= useRecoilState<Itinerary>(currentlyViewingItineraryState);

    const ref = useRef<HTMLDivElement>(null);
    const itineraryItemsRef = useRef(itineraryItemsState.items);

    useEffect(() => {
      itineraryItemsRef.current = itineraryItemsState.items;
    }, [itineraryItemsState.items]);
  
    const dropIndexRef = useRef<number | null>(null);
    const [localNewDropIndex, setLocalNewDropIndex] = useState<number | null>(null)
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const dragDirection = draggedItemIndex && localNewDropIndex && draggedItemIndex >= localNewDropIndex ? true : false
  
    const [, drop] = useDrop(() => ({
      accept: "itineraryItem",
      hover: (item, monitor) => {
        if (!ref.current) return;
        if (!itineraryItemsRef.current) {
          console.error("itineraryItemsRef.current is undefined.");
          return;
        }
        const dragItemId = (monitor.getItem() as ItineraryItem).id;
        const draggedItem = itineraryItemsRef.current?.find(item => item.id === dragItemId);
        for (let i = 0; i < itineraryItemsRef.current.length; i++) {
          const item = itineraryItemsRef.current[i];      
          if (item.id === draggedItem?.id) {
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
        if (!itineraryItemsRef.current) {
          console.error("itineraryItemsRef.current is undefined.");
          return;
        }
        const dragItemId = (monitor.getItem() as ItineraryItem).id;
        const draggedItem = itineraryItemsRef.current.find(item => item.id === dragItemId);
            console.log("draggedItem", draggedItem)
        let draggedItemIndex = -1;
        for (let i = 0; i < itineraryItemsRef.current.length; i++) {
          const item = itineraryItemsRef.current[i];      
          if (item.id === draggedItem?.id) {
            draggedItemIndex = i;
            break;
          }
        }
  
        if (!draggedItem) {
          // Handle the case when draggedItem is undefined (optional)
          console.error("Dragged item not found.");
          return;
        }
        
        if (draggedItemIndex < 0) return;
        const newOrderedItems = itineraryItemsRef.current.filter((item, index) => 
        index !== draggedItemIndex);
        const updatedOrderedItems = [...newOrderedItems];
        const indexToUse = dropIndexRef.current ?? draggedItemIndex;
        updatedOrderedItems.splice(indexToUse, 0, draggedItem);
        // const updatedItemsWithNewTimes = updateStartTimes(updatedOrderedItems, draggedItem); //steps out to update start times
        setItineraryItemsState(prev=>({...prev, items: updatedOrderedItems}))
      },
    }));
    
  ////////////////////////////////////////////update start times
  const fixedDate = '2023-01-01';
  
  const updateStartTimes = (items: ItineraryItem[], draggedItem: ItineraryItem) => {
    if (!itineraryItemsRef.current) {
      console.error("itineraryItemsRef.current is undefined.");
      return;
    }
      const updatedItems = [...items];
      const dayStartTime = itineraryItemsRef.current[0].startTime?.time;
  
      for (let i = 0; i < updatedItems.length; i++) {
          console.log("index", i);
  
          const previousEndTime = i === 0 
              ? dayStartTime 
              : dayjs(fixedDate)
                  .hour(updatedItems[i-1].endTime?.time?.hour() || 0)
                  .minute(updatedItems[i-1].endTime?.time?.minute() || 0);
  
          const currentItemDuration = updatedItems[i].activityDuration || 0;
          console.log("duration", currentItemDuration);
  
          let userDefinedRespectedTime = updatedItems[i].userDefinedRespectedTime;
          let newStartTime; 
  
          if (updatedItems[i].id === draggedItem.id && updatedItems[i].userDefinedRespectedTime === true) {
              userDefinedRespectedTime = false;
          }
  
          if (i === 0 && updatedItems[i].userDefinedRespectedTime === false) {
              newStartTime = dayStartTime;
          } else if (updatedItems[i].userDefinedRespectedTime === true) {
              newStartTime = dayjs(fixedDate)
                  .hour(updatedItems[i].startTime?.time?.hour() || 0)
                  .minute(updatedItems[i].startTime?.time?.minute() || 0);
          } else {
              newStartTime = previousEndTime ? previousEndTime : dayStartTime;
          }
  
          const newEndTime = newStartTime 
              ? dayjs(newStartTime).add(currentItemDuration, 'minute')
              : updatedItems[i].endTime?.time;
  
          updatedItems[i] = {
              ...updatedItems[i],
              userDefinedRespectedTime: userDefinedRespectedTime,
              startTime: {...updatedItems[i].startTime, time: newStartTime},
              endTime: {...updatedItems[i].startTime, time: newEndTime},
          };
  
          console.log(updatedItems[i]);
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
      if (!itineraryItemsState.items) {
        return;
      }
      itemRefs.current = itineraryItemsState.items.map(itineraryItem => {
        const ref = itemRefs.current.find((itemRef) => itemRef.id === itineraryItem.id);
        return ref || { id: itineraryItem.id, ref: null };    });
      }, [itineraryItemsState.items]); 
    
      return (
        <div ref={ref} className={styles.parentDropDiv} >
          {itineraryItemsState.items?.map((itineraryItem: ItineraryItem, index: number) => {
            const isDraggedDownward = !dragDirection;
            const isDraggedUpward = dragDirection;
            const isHovered = localNewDropIndex === index && draggedItemIndex !== index;
            
            return (
              <IPVDraggable
                key={itineraryItem.id}
                id={itineraryItem.id || "default-id"} // Provide a default value here
                itineraryItem={itineraryItem}
                // handleShowHideDescription={handleShowHideDescription}
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
  
  export default IPVDroppable;
  