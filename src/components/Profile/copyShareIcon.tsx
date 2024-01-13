import React, { useState } from 'react';
import {DynamicFontAwesomeIcon} from '@/components';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import styles from './shareIcons.module.css'; // Importing the CSS module
import { authUserState } from '../../atoms/atoms'
import { useRecoilState } from 'recoil';
import ShareIcons from './shareIcons';

const CopyShareButton: React.FC = () => {
    const [user, setUser] = useRecoilState(authUserState)
    const copyIcon = <DynamicFontAwesomeIcon icon={faLink} />

    const copyToClipboard = () => {
        const url = `https://www.itinaru.com/${user?.uid}`;
        navigator.clipboard.writeText(url).then(() => {
        
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

  return (
    <button className={styles.button} onClick={copyToClipboard}>
      {copyIcon}
    </button>
  );
};

export default CopyShareButton;
