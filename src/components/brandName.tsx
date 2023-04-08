import React, { useEffect, useState } from 'react';
import styles from './brandName.module.css';

const BrandName: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // Match the animation duration

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return visible ? (
    <div className={styles.brandNameContainer}>
      <h1 className={styles.brandName}>itinaru</h1>
    </div>
  ) : null;
};

export default BrandName;