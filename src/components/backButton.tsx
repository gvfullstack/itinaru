import React from "react";

interface PageComponentProps {

  handleInputChange: (key: string, value: string | number | Date | undefined) => void; 
  backButtonText?: string
  prevPageStep?: string
}

const BackButton: React.FC<PageComponentProps> = (props) => {

  const handleClick = () => props.handleInputChange("curStep", props.prevPageStep)

  return <button className="backButton" onClick={handleClick}>{props.backButtonText}</button>;
};

export default BackButton;