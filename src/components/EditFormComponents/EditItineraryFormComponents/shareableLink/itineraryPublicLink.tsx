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
            setCopySuccess('copied!');
            setTimeout(() => setCopySuccess(''), 500); 
            // Reset the message after 2 seconds
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

        return (   
            <div>
                {copySuccess ?
                <div className={style.copySuccess}>{copySuccess}</div> 
                :
                <div 
                    style={{display:"flex", alignItems:"center"}}
                    onClick={copyToClipboard}
                >
                    <p
                    style={{cursor:"pointer"}}
                    >copy share link</p><span></span>
                    <button
                        className={style.copyItineraryLinkButton}
                        title={`Copy shareable link for this itinerary.`}
                        aria-label={`Copy shareable link for this itinerary.`}
                    >
                        {copyIcon}
                    </button>
                </div>
}       
            </div>

        );
    };

export default ItineraryLink;
