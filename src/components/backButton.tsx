import React from "react";
import styles from "./itinBuilderCSS/backButton.module.css";
import { DefinedProps } from "@/typeDefs";
import { useRecoilState } from "recoil";
import { curStepState } from "../../src/atoms/atoms";


const BackButton: React.FC<DefinedProps> = (props) => {
  const [curStep, setCurStep] = useRecoilState(curStepState);

  const handleInputChange = props.handleInputChange ? props.handleInputChange : () => {};

  const handleClick = () => {
    if (props.prevPageStep) {setCurStep(props.prevPageStep)}
}


  return <div className= {styles.backButtonContainer}>
    <button className= {styles.backButton} onClick={handleClick}>{props.backButtonText}</button>
  </div>
};

export default BackButton;