    import styles from './utilityToolbar.module.css'; // Replace with your actual CSS module file path    
    import CopyItineraryButton from './copyItineraryForEditByEndUser'; // Replace with your actual component path
    import ItineraryLink from '../shareableLink/itineraryPublicLink'; // Replace with your actual component path
    import {DynamicFontAwesomeIcon} from '@/components';
    import { faList,faExpandAlt, faHouseChimney, faSquareShareNodes, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
    import { useRouter } from 'next/router';
    import {currentlyViewingItineraryState} from '../../PublicItineraryViewComponents/publicItinViewAtoms';
    import {useRecoilState} from 'recoil';
    import React, { useState, useRef, useEffect } from 'react';
    import ShareIcons from '../shareableLink/shareIcons';
    import ShareButton from '../shareableLink/webShareAPIicon';
    
    type ButtonToolbarContainerProps = {
        toggleSummarySection: () => void;
        summarySectionHidden: boolean;
    };

    const ButtonToolbarContainer: React.FC<ButtonToolbarContainerProps> = ({ toggleSummarySection, summarySectionHidden }) => {
        const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
        const listIcon = <DynamicFontAwesomeIcon icon={faList} />
        const expandIcon = <DynamicFontAwesomeIcon icon={faExpandAlt} />
        const homeIcon = <DynamicFontAwesomeIcon icon={faHouseChimney} />
        const shareIcon = <DynamicFontAwesomeIcon icon={faSquareShareNodes} />
        const minimizeIcon = <DynamicFontAwesomeIcon icon={faWindowMinimize} />
        const router = useRouter(); // Hook to get router object
        const [displayShareIcons, setDisplayShareIcons] = useState(false);
        const sharePopupRef = useRef<HTMLDivElement>(null); // Ref for the popup


        const navigateHome = () => {
            router.push('/'); // Navigates to the home page
        };

        const toggleShareIconsVisibility = () => {
            setDisplayShareIcons(!displayShareIcons);
        };

        // Handler for click outside
        const handleClickOutside = (event: MouseEvent) => {
            console.log('handleClickOutside Ran', event)

            // Assert event.target as Node
            const target = event.target as Node;
        
            if (sharePopupRef.current && !sharePopupRef.current.contains(target)) {
                setDisplayShareIcons(false);
            }
        };

        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        return (
        <div className={styles.toolbarContainer}>
            <div className={styles.buttonToolbarContainer}>
                    <button
                        className={styles.utilityToolbarButton}
                        onClick={navigateHome}
                        title="Go to Home page"
                        aria-label="Go to Home page"
                    >
                        {homeIcon}
                    </button>
                    <button
                        className={styles.utilityToolbarButton}
                        onClick={toggleSummarySection}
                        title="Exapand/Collapse Summary Section"
                        aria-label="Exapand/Collapse Summary Section"
                    >
                        {summarySectionHidden ? expandIcon : listIcon}
                    </button>
                    <CopyItineraryButton /> 
                   
                    <button
                        className={styles.utilityToolbarButton}
                        onClick={toggleShareIconsVisibility}
                        title={`Share itinerary link.`}
                        aria-label={`Share itinerary link.`}
                    >
                        {shareIcon}
                    </button> 
                                         
            </div>
            <div 
                ref={sharePopupRef} 
                className={`${styles.shareItineraryPopupContainer} ${displayShareIcons ? styles.active : ''}`}>
                <button 
                className={styles.closeShareItineraryPopupContainerButton}
                onClick={()=>setDisplayShareIcons(false)}>  </button>                
                <ShareIcons itineraryId={itinerary?.id}  />
                <ShareButton 
                    title="link to itinerary" 
                    text="" 
                    url={`https://itinaru.com/viewItinerary/${itinerary?.id}`} />
            </div> 
    </div>

        );
    };

    export default ButtonToolbarContainer;
