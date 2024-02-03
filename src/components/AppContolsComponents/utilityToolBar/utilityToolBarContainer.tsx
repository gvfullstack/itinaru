    import styles from './utilityToolbar.module.css'; // Replace with your actual CSS module file path    
    import CopyItineraryButton from './copyItineraryForEditByEndUser'; // Replace with your actual component path
    import ItineraryLink from '../shareableLink/itineraryPublicLink'; // Replace with your actual component path
    import {DynamicFontAwesomeIcon} from '@/components';
    import { faPenToSquare, faList, faExpandAlt, faHouseChimney, faSquareShareNodes, faWindowMinimize, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';
    import { useRouter } from 'next/router';
    import {currentlyViewingItineraryState} from '../../PublicItineraryViewComponents/publicItinViewAtoms';
    import {useRecoilState} from 'recoil';
    import React, { useState, useRef, useEffect } from 'react';
    import ShareIcons from '../shareableLink/shareIcons';
    import ShareButton from '../shareableLink/webShareAPIicon';
    import JumboPlus from '../jumboPlus';
    import EditButton from "../shareableLink/editItinerary"

    type ButtonToolbarContainerProps = {
        toggleSummarySection: () => void;
        summarySectionHidden: boolean;
    };

    const ButtonToolbarContainer: React.FC<ButtonToolbarContainerProps> = ({ toggleSummarySection, summarySectionHidden }) => {
        const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
        const listIcon = <DynamicFontAwesomeIcon icon={faList} />
        const expandIcon = <DynamicFontAwesomeIcon icon={faExpandAlt} />
        const collapseIcon = <DynamicFontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
        const homeIcon = <DynamicFontAwesomeIcon icon={faHouseChimney} />
        const shareIcon = <DynamicFontAwesomeIcon icon={faSquareShareNodes} />
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

        const toolbarRef = useRef<HTMLDivElement>(null);
        const [isSticky, setIsSticky] = useState(false);
        const [initialTop, setInitialTop] = useState(0);
    
        useEffect(() => {
        // Set the initial top offset of the toolbar on mount
        setInitialTop(toolbarRef.current?.offsetTop ?? 0);

        const handleScroll = () => {
            if (window.scrollY >= initialTop) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [initialTop]);

        
        return (
        <div ref={toolbarRef} className={`${styles.toolbarContainer} ${isSticky ? styles.stickyToolbar : ''}`}>
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
                        {summarySectionHidden ? expandIcon : collapseIcon}
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
                    
                    <EditButton />
             
                    {/* <div
                        className={styles.utilityToolbarButtonJumboPlus}>
                        <JumboPlus />
                    </div> */}
                                         
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
                    url={`https://www.itinaru.com/viewItinerary/${itinerary?.id}`} />
            </div> 
            
    </div>

        );
    };

    export default ButtonToolbarContainer;
