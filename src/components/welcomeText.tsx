import React from "react";
import styles from "./itinBuilderCSS/welcomeText.module.css";
import {useRecoilValue} from "recoil";
import { destinationState } from "@/atoms/atoms";
import { DefinedProps } from "@/typeDefs";


const WelcomeText: React.FC<DefinedProps> = (props) => {
  const pageStep = props.pageStep ?? "0"
  const destination = useRecoilValue(destinationState)
  const destinationFieldPages = ["20T"]
  return (
    <div className={styles.welcomeTextContainer}>
      {props.introText && <p className={styles.introText}>{props.introText}</p>}
      {destinationFieldPages.includes(pageStep) &&
      destination && <p className={styles.destination}>{destination}</p>}
      {props.infoText1 && <p className={styles.infoText1}>{props.infoText1}</p>}
      {props.infoText2 && <p className={styles.infoText2}>{props.infoText2}</p>}
      {props.prompt && <p className={styles.prompt}>{props.prompt}</p>}

    </div>
  );
};

export default WelcomeText;