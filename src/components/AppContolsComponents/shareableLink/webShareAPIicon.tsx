import React from 'react';
import {DynamicFontAwesomeIcon} from '@/components';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import style from './shareIcons.module.css';
   
interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

const shareIcon = <DynamicFontAwesomeIcon icon={faShare} />

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content', error);
      }
    } else {
      console.log('Web Share API is not supported in your browser.');
    }
  };

  return <button className={style.otherShareOptions} onClick={handleShare}>{shareIcon} Share to  </button>;
};

export default ShareButton;
