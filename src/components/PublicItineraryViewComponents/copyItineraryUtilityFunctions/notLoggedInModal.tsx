// CustomModal.tsx
import React from 'react';
import styles from './notLoggedInModal.module.css';
import {useRecoilState} from 'recoil';
import {showNotLoggedInModal} from '../../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { useRouter } from 'next/router';




const CustomModal: React.FC = () => {
  const router = useRouter();

    const [showNotLoggedInModalState, setShowNotLoggedInModalState] = useRecoilState(showNotLoggedInModal);

   const closeModal = () => {
    setShowNotLoggedInModalState(false);
  } 
  // Function to handle click on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Close modal only if clicked on backdrop (not modal content)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  
  const handleLoginLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("login link clicked")
    event.preventDefault();
    // Store the current path.
    sessionStorage.setItem('preLoginRoute', router.asPath);
    // Navigate to login page.
    router.push('/loginPage');
    closeModal();
  
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button onClick={closeModal} className={styles.closeButton} aria-label="Close">&times;</button>
        <p className={styles.modalMessage}>
        To access this feature, please sign in with your email. If you&apos;re new, you&apos;ll have the option to create an account.        </p>
        <div className={styles.modalActions}>
          <button onClick={handleLoginLinkClick} className={styles.modalButton}>
           Login/Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
