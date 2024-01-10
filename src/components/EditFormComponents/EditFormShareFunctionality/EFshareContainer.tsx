import React, { useState } from 'react';
import styles from './EFshareContainer.module.css';
import UserAutocomplete from './userAutocomplete';
import {DynamicFontAwesomeIcon} from '@/components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import ShareWhitelistUsers from './EFshareWhitelistUsers';

interface Props {
    viewHideModal: () => void;
  }

function SharingModal({ viewHideModal }: Props) {  
    
    const faXmarkIcon = (
        <DynamicFontAwesomeIcon 
            icon={faXmark} 
            className={styles.faXmark} 
            type="button" 
            onClick={()=>viewHideModal()}
        />
    );

    return (
        <div className={styles.modal}>                    
           <div className={styles.innerModalContainer}>
                <div className={styles.shareTopNav}>   
                    <p>Share</p>
                    {faXmarkIcon} 
                </div>
                <UserAutocomplete />
                <p className = {styles.sharedUserListHeader}>Shared user list</p>
                <ShareWhitelistUsers accessType="readAccess"/>                
                <ShareWhitelistUsers accessType="editAccess"/>
            </div>
        </div>

      )
}

export default SharingModal;
