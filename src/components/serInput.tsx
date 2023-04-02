import React from "react";

interface Props {
  heading: string;
  inputName: string;
  inputValue: string | number | string[];
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserInput: React.FC<Props> = ({ heading, inputName, inputValue, onInputChange }) => {
  return (
    <div>
      <h2>{heading}</h2>
      <label htmlFor={inputName}>{inputName}:</label>
      {typeof inputValue === "number" ? (
        <input type="number" id={inputName} value={inputValue} onChange={onInputChange} />
      ) : (
        <input type="text" id={inputName} value={inputValue} onChange={onInputChange} />
      )}
    </div>
  );
};

export default UserInput;





