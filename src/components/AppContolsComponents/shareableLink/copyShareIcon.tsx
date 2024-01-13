import React, { useState } from 'react';
import {DynamicFontAwesomeIcon} from '@/components';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import styles from './shareIcons.module.css'; // Importing the CSS module
import { useRecoilState } from 'recoil';

interface ItineraryLinkProps {
  itineraryId: string | undefined;
}


const CopyShareButton: React.FC<ItineraryLinkProps> = ({ itineraryId }) => {
    const copyIcon = <DynamicFontAwesomeIcon icon={faLink} />

    const copyToClipboard = () => {
        const url = `https://www.itinaru.com/viewItinerary/${itineraryId}`;
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
