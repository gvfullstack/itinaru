import React, { useState, useEffect, useCallback } from "react";
import styles from "./itinBuilderCSS/multipleSelectButton.module.css";
const { v4: uuidv4 } = require('uuid');
import { DefinedProps } from "./../../src/typeDefs" 
import { ageRangeOptionsState } from "../../src/atoms/atoms";
import { useRecoilState } from 'recoil';


type Option = {
  label: string;
  selected: boolean;
}

const MultipleSelectButtonList: React.FC<DefinedProps> = (props) => {

  const [optionList, setOptionList] = useRecoilState<Option[]>(props.multipleSelectOptions as any)
   
  const handleOptionSelect =((option: Option) => {
    setOptionList(prevState => {
      const updatedOptionList = prevState.map((stateOption) => {
        if(stateOption.label === option.label) {
          return {...stateOption, selected: !stateOption.selected}
        }
        else {       
          return stateOption}
      })
      return updatedOptionList;
    }
  )})
   
  return (
    <div className={styles.multiSelectButtonContainer}>
      {optionList.map((option:Option) => (
        <button
          key={uuidv4()}
          onClick={() => handleOptionSelect(option)}
          className= {`${styles.multiSelectButton} ${option.selected ? styles.selected : ""}`}
          >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default MultipleSelectButtonList;