// CustomModal.tsx
import React from 'react';
import styles from './notLoggedInModal.module.css';
import {useRecoilState} from 'recoil';
import {showNotLoggedInModal} from '../../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { useRouter } from 'next/router';


type CustomModalProps = {
  onClose: () => void;
  onLogin: () => void;
};

const CustomModal: React.FC<CustomModalProps> = ({ onClose, onLogin }) => {
  const router = useRouter();

    const [showNotLoggedInModalState, setShowNotLoggedInModalState] = useRecoilState(showNotLoggedInModal);

  // Function to handle click on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Close modal only if clicked on backdrop (not modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  
  const handleLoginLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Store the current path.
    sessionStorage.setItem('preLoginRoute', router.asPath);
    // Navigate to login page.
    router.push('/loginPage');
    onLogin();  
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <p className={styles.modalMessage}>
          You may continue without logging in, but your changes will be lost on refresh or upon leaving the website.
        </p>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.modalButton}>
            Continue Without Login
          </button>
          <button onClick={()=>handleLoginLinkClick} className={styles.modalButton}>
            Take Me to the Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
