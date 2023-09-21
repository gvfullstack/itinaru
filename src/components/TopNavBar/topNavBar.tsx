import React, { useEffect, useState } from 'react';
import styles from './topNavBar.module.css';
// import Menu from "../AppContolsComponents/mainMenuLink" 
import Link from 'next/link';
// import JumboPlus from '../AppContolsComponents/jumboPlus';

const TopNavBar: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      // This will set "scrolled" to true when the user scrolls more than 10 pixels
      // You can adjust the value as needed
      setScrolled(window.scrollY > 2);
    };

    // Add the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return  (
    <div className={styles.nav}>
      <div 
      className={`${styles.topNavContainer}`}>
          <div></div>
          <div></div>
          <div>
            <Link href="/"  
              style={{textDecoration:"none"}}> {/* Link to the home page */}
                  <h1 className={styles.title}>
                    itinaru</h1>
            </Link> 
          </div>
          <div></div>
          <div className = {styles.rightTopNavBar} >
            {/* <JumboPlus />     
            <Menu />        */}
          </div> 
      </div>
    {scrolled && <div className={styles.navBuffer}></div>}
    </div>
  ) 
  
};

export default TopNavBar;