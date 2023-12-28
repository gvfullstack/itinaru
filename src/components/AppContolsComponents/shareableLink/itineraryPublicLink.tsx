import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import style from './itineraryPublicLink.module.css';

interface ItineraryLinkProps {
    itineraryId: string | undefined;
  }

const ItineraryLink: React.FC<ItineraryLinkProps> = ({ itineraryId }) => {
    const copyIcon = <FontAwesomeIcon icon={faLink} />
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        const url = `https://www.itinaru.com/viewItinerary/${itineraryId}`;
        navigator.clipboard.writeText(url).then(() => {
            // You can display a confirmation message or toast here if needed
            setCopySuccess('copied');
            setTimeout(() => setCopySuccess(''), 500); 
            // Reset the message after 2 seconds
            console.log('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

        return (                
               <div className={style.ItineraryLinkSection}>
                    {!copySuccess &&
                        <p className={style.ItineraryLinkSectionHeader}>
                            shareable link
                        </p>}
                    {!copySuccess &&
                        <p className={style.ItineraryLinkSectionBody}>                   
                            <button     
                                className={style.copyItineraryLinkButton}
                                onClick={copyToClipboard}
                                title={`https://www.itinaru.com/viewItinerary/${itineraryId}`}
                                >
                                {copyIcon}
                            </button>
                        </p>
                    }
                {copySuccess && <p className={style.ItineraryLinkSectionCopy}>{copySuccess}</p>}
            </div>
        );
    };

export default ItineraryLink;
