import React, { useState } from 'react';
import styles from './shareIcons.module.css';
import {
    EmailShareButton,
    EmailIcon,FacebookShareButton,
    FacebookIcon,RedditShareButton,
    RedditIcon, TwitterShareButton,
    TwitterIcon,WhatsappShareButton,
    WhatsappIcon,
  } from 'next-share'
import CopyShareButton from './copyShareIcon'
import { authUserState } from '../../atoms/atoms'
import { useRecoilState } from 'recoil';

const ShareIcons: React.FC = () => {
    const [authUser, setAuthUser] = useRecoilState(authUserState)
    const shareUrl = `https://www.itinaru.com/user/${authUser?.uid}/publicUserProfileLoading`;
    const subject = 'Link to my itinaru itineraries, profile page.';
    const body = 'Hello, I would like to share my itinaru itineraries profile page with you.';

    return (  
        
        <div>   
            <p className={styles.shareProfileHeading}>Share profile link</p>
            <div className={styles.shareProfileLinksContainer}>
                <div className={styles.iconWrapper}>
                <EmailShareButton
                        url={shareUrl}
                        subject={subject}
                        body={body}
                        >
                        <EmailIcon size={24} round />
                </EmailShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <FacebookShareButton
                        url={shareUrl}
                        quote={subject}
                        hashtag={'#itinaru'}
                    >
                        <FacebookIcon size={24} round />
                </FacebookShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <RedditShareButton
                        url={shareUrl}
                        title={subject}
                    >
                    <RedditIcon size={24} round />
                </RedditShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <TwitterShareButton
                        url={shareUrl}
                        title={subject}
                    >
                        <TwitterIcon size={24} round />
                </TwitterShareButton>
                </div>
                <div className={styles.iconWrapper}> 
                <WhatsappShareButton
                        url={shareUrl}
                        title={subject}
                        separator=":: "
                    >
                        <WhatsappIcon size={24} round />
                </WhatsappShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <CopyShareButton />
                </div>
            </div>
        </div>
    );
};

export default ShareIcons;