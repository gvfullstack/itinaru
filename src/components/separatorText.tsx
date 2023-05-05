import React from "react";
import styles from "./itinBuilderCSS/separatorText.module.css";

type PageComponentProps = { 
  separatorText?: string;
};


const SeparatorText: React.FC<PageComponentProps> = (props) => {
  
  return (
    <div className={styles.separatorTextContainer}>
      <p className={styles.separatorText}>{props.separatorText}</p>
    </div>
  );
};

export default SeparatorText;