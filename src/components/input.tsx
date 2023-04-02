import { useState } from "react";

type InputProps = {
  label: string;
  value: string | number | Date;
  onChange: (value: string | number | Date) => void;
};

const Input = ({ label, value, onChange }: InputProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="text" value={value} onChange={handleInputChange} />
    </div>
  );
};

export default Input;