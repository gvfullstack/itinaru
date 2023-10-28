import React, { useState, useEffect } from "react";
import styles from './durationPicker.module.css';
import { Itinerary } from '../editFormTypeDefs'; 
import { useRecoilState } from 'recoil';
import { currentlyEditingItineraryState } from '../editFormAtoms';

interface DurationPickerProps {
  itemId: string;
}

const DurationPicker: React.FC<DurationPickerProps> = ({ itemId }) => {
  const [selectedHour, setSelectedHour] = useState<string>("0");
  const [selectedMinute, setSelectedMinute] = useState<string>("0");
  const [itineraryInEdit, setItineraryInEdit] = useRecoilState<Itinerary>(currentlyEditingItineraryState);

  useEffect(() => {
    // Find the initial duration for the given itemId
    const targetItem = itineraryInEdit.items?.find(item => item.id === itemId);
    if (targetItem && typeof targetItem.activityDuration === 'number') {
      const initialDuration = targetItem.activityDuration;
      const initialHours = Math.floor(initialDuration / 60);
      const initialMinutes = initialDuration % 60;

      setSelectedHour(initialHours.toString());
      setSelectedMinute(initialMinutes.toString());
    }
  }, []); // empty dependency array, runs only once when the component mounts


  const handleTimeChange = () => {
    const totalMinutes = parseInt(selectedHour, 10) * 60 + parseInt(selectedMinute, 10);
    if (itineraryInEdit.items) {
      const targetItemIndex = itineraryInEdit.items.findIndex(item => item.id === itemId);

      if (targetItemIndex >= 0) {
        const updatedItems = [...itineraryInEdit.items];
        updatedItems[targetItemIndex] = {
          ...updatedItems[targetItemIndex],
          activityDuration: totalMinutes
        };

        setItineraryInEdit({
          ...itineraryInEdit,
          items: updatedItems
        });
      }
    }
  };


  useEffect(() => {
    handleTimeChange();
  }, [selectedHour, selectedMinute]);

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(event.target.value);
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(event.target.value);
  };

  return (
    <div className={styles.durationSection}>
      <div className={styles.heading}>Duration</div>
      <div className={styles.borderContainer}>
        <div className={styles.marginRight}>
          <label className={styles.label} htmlFor="hours">Hours: </label>
          <select className={styles.select} id="hours" onChange={handleHourChange} value={selectedHour}>
            {Array.from({ length: 25 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className={styles.label} htmlFor="minutes">Minutes: </label>
          <select className={styles.select} id="minutes" onChange={handleMinuteChange} value={selectedMinute}>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={i * 5}>
                {i * 5}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DurationPicker;
