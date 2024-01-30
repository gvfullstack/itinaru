// SkeletonComponent.js
import React from 'react';
import styles from './gptUserTokenSkeleton.module.css'; // Import the CSS module

const SkeletonComponent = () => {
  return (
    <div className={styles.skeletonWrapper}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  );
};

export default SkeletonComponent;
