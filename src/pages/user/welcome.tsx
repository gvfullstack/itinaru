import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/welcome.module.css';

const WelcomeModal = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if running in the browser environment
    if (typeof window !== 'undefined') {
      // Set a timer to redirect after showing the welcome message
      const timer = setTimeout(() => {
        const postLoginRoute = sessionStorage.getItem('preLoginRoute');
        router.push(postLoginRoute || '/');
      }, 500);

      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [router]);

  return (
    <div className={styles.modal}>
      <h1>Welcome back!</h1>
    </div>
  );
};

export default WelcomeModal;
