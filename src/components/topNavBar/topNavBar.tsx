import React, { useEffect, useState } from 'react';
import styles from './topNavBar.module.css';
import Menu from "../AppContolsComponents/mainMenuLink" 
import Link from 'next/link';
import JumboPlus from '../AppContolsComponents/jumboPlus';

const TopNavBar: React.FC = () => {
  
  return  (
    <div 
    className={`${styles.topNavContainer} ${styles.animationComplete}`} 
      >
      <div></div> {/* Empty div to create space */}
      <div></div> {/* Empty div to create space */}
      <Link href="/"  
        style={{textDecoration:"none"}}> {/* Link to the home page */}
            <h1 className={`${styles.staticAnimationComplete}`}>
              itinaru</h1>
      </Link> 

      <div className = {styles.rightTopNavBar} >
        <JumboPlus />     
        <Menu />       
      </div> 
    </div>
  ) 
  
};

export default TopNavBar;