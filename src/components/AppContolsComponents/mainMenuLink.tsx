import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; 
import styles from './Menu.module.css';
import { authUserState } from '../../atoms/atoms'
import { useRecoilState } from 'recoil';
import { logout } from '../FirebaseAuthComponents/config/firebase.auth.js';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


const Menu: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null)


  const hamburgerIcon = <FontAwesomeIcon icon={faBars} className= {styles.hamburgerIcon} />;
  
  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
  };

  useEffect(() => {
    // Function to handle the document click
    function handleDocumentClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    }

    // Attach the event listener
    document.addEventListener('click', handleDocumentClick);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        // Handle any errors that may occur during logout
      });
  };

  const handleLoginLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Store the current path.
    sessionStorage.setItem('preLoginRoute', router.asPath);

    // Navigate to login page.
    router.push('/loginPage');
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button onClick={toggleMenu} className={styles.menuButton}>
          <span className={styles.hamburgerIconContainer}>{hamburgerIcon}</span>
          <span className={styles.menuText}>Menu</span>
      </button> <div className={`${styles.menuBar} ${menuVisible ? styles.show : ''}`}>
        <button onClick={toggleMenu} className={styles.closeButton}>Close</button>
        <ul className={styles.menuOptions}>
          {authUser &&
            <li className={styles.profileInfoContainer}>
              {authUser.profilePictureUrl && 
              <div className={styles.profilePicImageContainer}>
                <img src={authUser?.profilePictureUrl || ''} 
                alt=""
                className={styles.profilePicture}
                />      
              </div>}
              <div className={styles.profileText}>
                username: {authUser?.username}
              </div>
            </li>}
          <li className={styles.menuOption}>
            <Link href="/">Home</Link>
          </li>          
          <li className={styles.menuOption}>
            <Link href="/aiAssistedItinerary">AI Assisted Itinerary</Link>
          </li>
          {authUser && 
          <li className={styles.menuOption}>
            <Link href="/profileSettings">Account Settings</Link>
          </li>}
          <li className={styles.menuOption}>
            {authUser ? 
              <Link href="/loginPage" onClick={handleLogout}>Logout</Link> : 
              <Link href="/loginPage" onClick={handleLoginLinkClick}>Login</Link>}
          </li>
        </ul>
      </div>
      {/* <button onClick={()=>console.log(authUser)}></button> */}
    </div>
  );
};

export default Menu;

