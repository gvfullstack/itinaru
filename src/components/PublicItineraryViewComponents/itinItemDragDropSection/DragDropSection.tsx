import React, {useEffect, useState} from "react";
import styles from './dragDrop.module.css';
import IPVDroppable from './IPVDroppable';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const DragDropSection: React.FC = () => {

  return (      
  <DndProvider backend={HTML5Backend}>
    <div className={styles.itineraryArrOfItemsContainer}>
      <IPVDroppable />
    </div>
  </DndProvider>
  );
};

export default DragDropSection;
