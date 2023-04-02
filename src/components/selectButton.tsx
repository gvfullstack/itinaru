import React, { useState } from "react";

interface Props {
  options: string[];
  onSelect: (selectedValue: string) => void;
}

const SelectButton: React.FC<Props> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div>
      <h2>Select an option:</h2>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleOptionSelect(option)}
          className={selectedOption === option ? "selected" : ""}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SelectButton;