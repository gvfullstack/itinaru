import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Dayjs  } from 'dayjs';
import dayjs from 'dayjs';
import { Itinerary, ItineraryItem } from '../editFormTypeDefs';
import { currentlyEditingItineraryState } from '../editFormAtoms';
import styles from './endTimeDisplay.module.css'
interface EndTimeDisplayProps {
  itemId: string;
}


const EndTimeDisplay: React.FC<EndTimeDisplayProps> = ({ itemId }) => {
  const [itineraryInEdit, setItineraryInEdit] = useRecoilState<Itinerary>(currentlyEditingItineraryState);

  const calculateEndTime = (startTime: Dayjs, duration: number): Dayjs => {
    return startTime.add(duration, 'minute');
  };

  // Find the specific item by its itemId
  const targetItem = itineraryInEdit.items?.find(item => item.id === itemId);
  
  // Extract startTime and activityDuration for this item
  const startTime = targetItem?.startTime?.time;
  const activityDuration = targetItem?.activityDuration;

useEffect(() => {
  // Check if startTime is a valid Dayjs object and activityDuration is defined
  if (dayjs.isDayjs(startTime) && startTime.isValid() && activityDuration !== undefined) {
    const endTime = calculateEndTime(startTime, activityDuration);

    // Find the index of the target item
    const targetItemIndex = itineraryInEdit.items!.findIndex(item => item.id === itemId);

    // Update the state
    const updatedItems = [...itineraryInEdit.items!];
    updatedItems[targetItemIndex] = {
      ...updatedItems[targetItemIndex],
      endTime: { time: endTime },
    };

    setItineraryInEdit({
      ...itineraryInEdit,
      items: updatedItems,
    });
  }
}, [startTime, activityDuration]);



  return (
    <div className={styles.endTimeContainer}>
      <div className={styles.floatingLabel}>Auto End Time</div>
      {targetItem && targetItem.endTime?.time ? (
        <div className={styles.endTimeTimeContainer}>{targetItem.endTime.time.format('hh:mm A')}</div>
      ) : (
        <div>End Time</div>
      )}
    </div>
  );
};

export default EndTimeDisplay;
