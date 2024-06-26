import React, {useEffect, useState} from "react";
import styles from '../EditFormCSS/editItineraryCSS.module.css';
import EFDroppable from './EFDroppable';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomDragLayer from "./CustomDragLayer";

const DragDropSection: React.FC = () => {

  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      {/* <CustomDragLayer />  */}
      <EFDroppable />
    </div>
  </DndProvider>
  );
};

export default DragDropSection;
