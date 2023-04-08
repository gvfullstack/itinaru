import React from "react";
import styles from "./backButton.module.css";

type HandleInputChange = (key: string, value: string | number | Date | undefined | boolean | string[]) => void;

interface PageComponentProps {

  handleInputChange?: HandleInputChange; 
  backButtonText?: string
  prevPageStep?: string
}

const BackButton: React.FC<PageComponentProps> = (props) => {

  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};

  const handleClick = () => handleInputChange("curStep", props.prevPageStep)

  return <div className= {styles.backButtonContainer}>
    <button className= {styles.backButton} onClick={handleClick}>{props.backButtonText}</button>
  </div>
};

export default BackButton;