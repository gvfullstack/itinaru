import React from 'react';
import styles from './itinGalCompWrapper.module.css';

type Props = {
  children: React.ReactNode;
};

const ItinGalCompWrapper: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default ItinGalCompWrapper;

