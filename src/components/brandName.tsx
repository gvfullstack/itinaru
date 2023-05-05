import React, { useEffect, useState } from 'react';
import styles from './itinBuilderCSS/brandName.module.css';




const BrandName: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationEnd = () => {
    setAnimationComplete(true);
  };


  return  (
    <div className={`${styles.brandNameContainer} ${animationComplete ? styles.animationComplete : ''}`} 
      onAnimationEnd={handleAnimationEnd}>
    <h1 className={`${styles.brandName} ${animationComplete ? styles.animationComplete : ''}`}>itinaru</h1>
    </div>
  ) 
  
};

export default BrandName;