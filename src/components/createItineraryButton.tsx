import React from "react";
import styles from "./createItineraryButton.module.css";

interface PageComponentProps {
  createButtonText?: string;
  handleCreateItinerary?: () => void;
}

const CreateItineraryButton: React.FC<PageComponentProps> = (props) => {
  return (
    <div className={styles.createItineraryButtonContainer}>
      <button className={styles.createItineraryButton} onClick={props.handleCreateItinerary}>{props.createButtonText}</button>
    </div>
  );
};

export default CreateItineraryButton;