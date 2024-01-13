import React, { useState } from 'react';
import {DynamicFontAwesomeIcon} from '@/components';
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons';
import style from './itineraryPublicLink.module.css';
import style2 from '../utilityToolBar/utilityToolbar.module.css';
import { set } from 'lodash';
import ShareIcons from './shareIcons';
interface ItineraryLinkProps {
    toggleShareIconsVisibility: ()=> void;
  }

const ItineraryLink: React.FC<ItineraryLinkProps> = ({toggleShareIconsVisibility }) => {
    const shareIcon = <DynamicFontAwesomeIcon icon={faSquareShareNodes} />

        return (  
                <button
                    className={style2.utilityToolbarButton}
                    onClick={toggleShareIconsVisibility}
                    title={`Share itinerary link.`}
                    aria-label={`Share itinerary link.`}
            >
                    {shareIcon}
                </button>                  
        );
    };

export default ItineraryLink;
