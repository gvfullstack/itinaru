    import styles from './utilityToolbar.module.css'; // Replace with your actual CSS module file path
    import CopyItineraryButton from './copyItineraryForEditByEndUser'; // Replace with your actual component path
    import ItineraryLink from '../shareableLink/itineraryPublicLink'; // Replace with your actual component path
    import {DynamicFontAwesomeIcon} from '@/components';
    import { faList,faExpandAlt, faHouseChimney } from '@fortawesome/free-solid-svg-icons';
    import { useRouter } from 'next/router';
    import {currentlyViewingItineraryState} from '../../PublicItineraryViewComponents/publicItinViewAtoms';
    import {useRecoilState} from 'recoil';

    type ButtonToolbarContainerProps = {
        toggleSummarySection: () => void;
        summarySectionHidden: boolean;
    };

    const ButtonToolbarContainer: React.FC<ButtonToolbarContainerProps> = ({ toggleSummarySection, summarySectionHidden }) => {
        const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
        const listIcon = <DynamicFontAwesomeIcon icon={faList} />
        const expandIcon = <DynamicFontAwesomeIcon icon={faExpandAlt} />
        const homeIcon = <DynamicFontAwesomeIcon icon={faHouseChimney} />
        const router = useRouter(); // Hook to get router object

        const navigateHome = () => {
            router.push('/'); // Navigates to the home page
        };

        return (
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
                    <ItineraryLink itineraryId={itinerary?.id} /> 
            </div>
        );
    };

    export default ButtonToolbarContainer;
