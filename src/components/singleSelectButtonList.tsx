import React, { useEffect, useState } from "react";
import styles from "./itinBuilderCSS/singleSelectButton.module.css";
import { DefinedProps } from "../../src/typeDefs";
import { useRecoilState, RecoilState } from "recoil";
import {defaultAtom, selectedPaceState} from "@/atoms/atoms";


const { v4: uuidv4 } = require('uuid');

type Option = {
  numVal: string;
  label: string;
  selected: boolean;
}


const singleSelectButtonList: React.FC<DefinedProps> = (props) => {
  const [value, setValue] = useRecoilState<Option[]>(props.singleSelectOptions ??  defaultAtom);
  const [selectedPace, setSelectedPace] = useRecoilState(selectedPaceState);

  const handleOptionSelect = (option: Option) => {
    if(props.keyOfStateVariable==="specificPace") {
        setSelectedPace(option.numVal)
    }

    const newValue = value.map((item) => ({
      ...item,
      selected: item.label === option.label ? true : false,
    }));
    setValue(newValue);
  };

  useEffect(() => {console.log(value)})

  return (
    <div className={styles.singleSelectButtonContainer}>
      {value.map((option: Option) => (
          <button
          key={uuidv4()}
          onClick={() => handleOptionSelect(option)}
          className={`${styles.singleSelectButton} ${option.selected ? styles.selected : ""}`}
          >
            {option.label}
          </button>   

      ))}
    </div>
  );
};

export default singleSelectButtonList;