import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import style from './itineraryPublicLink.module.css';
import style2 from '../utilityToolBar/utilityToolbar.module.css';
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
            setCopySuccess('share link copied!');
            setTimeout(() => setCopySuccess(''), 500); 
            // Reset the message after 2 seconds
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

        return (                            
            <button
                className={style2.utilityToolbarButton}
                onClick={copyToClipboard}
                title={`Copy shareable link for this itinerary.`}
                aria-label={`Copy shareable link for this itinerary.`}
          >
                {copySuccess ? copySuccess : copyIcon}
            </button>                                    
        );
    };

export default ItineraryLink;
