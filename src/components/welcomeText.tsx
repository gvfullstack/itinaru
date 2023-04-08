import React from "react";
import styles from "./welcomeText.module.css";

type PageComponentProps = { 
  introText?: string;
  infoText1?: string;
  infoText2?: string;
  prompt?: string;
  destinationText?: string;
};


const WelcomeText: React.FC<PageComponentProps> = (props) => {
  
  const destination = props.destinationText ? props.destinationText.toUpperCase() : "";
  
  return (
    <div className={styles.welcomeTextContainer}>
      <p className={styles.introText}>{props.introText}</p>
      <p className={styles.destination}>{destination}</p>
      <p className={styles.infoText1}>{props.infoText1}</p>
      <p className={styles.infoText2}>{props.infoText2}</p>
      <p className={styles.prompt}>{props.prompt}</p>

    </div>
  );
};

export default WelcomeText;