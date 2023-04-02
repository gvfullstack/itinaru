import React from "react";
import { definedProps } from "../pages/PageComponent";

type PageComponentProps = { 
  definedProps: definedProps;
};


const WelcomeText: React.FC<PageComponentProps> = (
  {definedProps}) => {

  return (
    <div>
      <p>{introText}</p>
      <p>{infoText1}</p>
      <p>{infoText2}</p>
      <p>{prompt}</p>

    </div>
  );
};

export default WelcomeText;