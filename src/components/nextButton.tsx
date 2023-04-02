import React from "react";

interface Props {
  onClick: () => void;
  message: string;
}

const NextButton: React.FC<Props> = ({ onClick, message }) => {
  return <button onClick={onClick}>{message}</button>;
};

export default NextButton;