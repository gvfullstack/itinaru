import React, { useEffect, useState } from 'react';
import styles from './itinBuilderCSS/brandName.module.css';
import {brandPageRender} from '../atoms/atoms'
import { useRecoilState, atom } from "recoil";

const BrandName: React.FC = () => {
  const [brandPage, setBrandPage] = useRecoilState(brandPageRender);
  const animationComplete = brandPage.animationComplete
    // const [animationComplete, setAnimationComplete] = useState(false);
  console.log("Brand Name just rendered")

  const handleAnimationEnd = () => {
    setBrandPage(prev => ({ ...prev, animationComplete: true }));
  };


  return  (
    <div className={`${styles.brandNameContainer} ${animationComplete ? styles.animationComplete : ''}`} 
      onAnimationEnd={handleAnimationEnd}>
    <h1 className={`${styles.brandName} ${animationComplete ? styles.animationComplete : ''}`}>itinaru</h1>
    </div>
  ) 
  
};

export default BrandName;