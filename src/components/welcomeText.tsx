import React from "react";

type PageComponentProps = { 
  introText?: string;
  infoText1?: string;
  infoText2?: string;
  prompt?: string;};


const WelcomeText: React.FC<PageComponentProps> = (
  {introText, infoText1, infoText2, prompt}) => {

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