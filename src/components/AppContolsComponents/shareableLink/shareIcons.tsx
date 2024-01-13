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

interface ItineraryLinkProps {
    itineraryId: string | undefined;
  }


const ShareIcons: React.FC<ItineraryLinkProps> = ({ itineraryId }) => {

    const shareUrl = `https://itinaru.com/viewItinerary/${itineraryId}`;
    const subject = 'Link to my itinaru itineraries, profile page.';
    const body = 'Hello, I would like to share my itinaru itineraries profile page with you.';

    return (          
        <div>   
            <p className={styles.shareItineraryHeading}>Share profile link</p>
            <div className={styles.shareItineraryLinksContainer}>
                <div className={styles.iconWrapper}>
                <EmailShareButton
                        url={shareUrl}
                        subject={subject}
                        body={body}
                        >
                        <EmailIcon size={36} round />
                </EmailShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <FacebookShareButton
                        url={shareUrl}
                        quote={subject}
                        hashtag={'#itinaru'}
                    >
                        <FacebookIcon size={36} round />
                </FacebookShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <RedditShareButton
                        url={shareUrl}
                        title={subject}
                    >
                    <RedditIcon size={36} round />
                </RedditShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <TwitterShareButton
                        url={shareUrl}
                        title={subject}
                    >
                        <TwitterIcon size={36} round />
                </TwitterShareButton>
                </div>
                <div className={styles.iconWrapper}> 
                <WhatsappShareButton
                        url={shareUrl}
                        title={subject}
                        separator=":: "
                    >
                        <WhatsappIcon size={36} round />
                </WhatsappShareButton>
                </div>
                <div className={styles.iconWrapper}>
                <CopyShareButton itineraryId={itineraryId}/>
                </div>
            </div>
        </div>
    );
};

export default ShareIcons;