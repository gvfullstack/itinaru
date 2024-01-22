import React, { useEffect, useState } from 'react';
import styles from './topNavBar.module.css';
import Menu from "../AppContolsComponents/mainMenuLink";
import JumboPlus from '../AppContolsComponents/jumboPlus';

const TopNavBar: React.FC = () => {
  const [lastScrollY, setLastScrollY] = useState(0); // Initialize with 0
  const [navBarVisible, setNavBarVisible] = useState(true);

  useEffect(() => {
    // Update the initial scroll position when the component mounts
    setLastScrollY(window.scrollY);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setNavBarVisible(false);
      } else {
        // Scrolling up
        setNavBarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return  (
    <div className={`${styles.nav} ${navBarVisible ? '' : styles.navHidden}`}>
      <div 
      className={`${styles.topNavContainer}`}>
          <div></div>
          <div></div>
          <div>
            <h1 className={styles.title}>
              itinaru
            </h1>
          </div>
          <div></div>
          <div className = {styles.rightTopNavBar} >
            <div className={styles.jumboVisibilityContainer}>
              <JumboPlus />     
            </div>
            <Menu />       
          </div> 
      </div>
    {/* {scrolled && <div className={styles.navBuffer}></div>} */}
    </div>
  ) 
  
};

export default TopNavBar;