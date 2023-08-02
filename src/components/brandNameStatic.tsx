import React, { useEffect, useState } from 'react';
import styles from './itinBuilderCSS/brandName.module.css';


const BrandNameStatic: React.FC = () => {
  
  return  (
    <div 
    className={`${styles.brandNameContainer} ${styles.animationComplete}`} 
      >
      <h1 className={`${styles.staticAnimationComplete}`}>itinaru</h1>
    </div>
  ) 
  
};

export default BrandNameStatic;