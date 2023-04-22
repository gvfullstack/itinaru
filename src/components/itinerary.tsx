import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import {itineraryItemsState, perPersonAverageBudgetState} from '../../src/atoms/atoms';
import { useRecoilState } from 'recoil';
import styles from '../components/itinBuilderCSS/itinerary.module.css';
import YouTubeSearch from "./youtubeSearch";
import { ItineraryItem } from "../typeDefs";
const { v4: uuidv4 } = require('uuid');
import Head from 'next/head';



const Itinerary: React.FC = () => {
    const caretDown2 = <FontAwesomeIcon icon={faCaretDown} />;
    const ellipsisVertical = <FontAwesomeIcon icon={faEllipsisVertical} />;

const [itineraryItems, setItineraryItems] = useRecoilState(itineraryItemsState);
const [perPersonAverageBudget, setperPersonAverageBudget] = useRecoilState(perPersonAverageBudgetState);


const handleShowHideDescription = (curItineraryItem: ItineraryItem) => {
    setItineraryItems(prevState => {
      const updatedNeighborhoods = prevState.map((itineraryItem) => {
        if(curItineraryItem.venue === itineraryItem.venue) {
          return {...itineraryItem, descHidden: !itineraryItem.descHidden}
        }
        else {       
          return itineraryItem}
      })
      return updatedNeighborhoods;
    });
  };

const openGoogleMapsDirection = async (destinationAddress?: string) => {
    try {
      // Request user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
  
      const originLat = position.coords.latitude;
      const originLng = position.coords.longitude;

      if (!destinationAddress) {
        console.error('Destination address is undefined');
        return;
      }
        // Encode the destination address for use in a URL
      const encodedDestinationAddress = encodeURIComponent(destinationAddress);

      // Build Google Maps directions URL
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${encodedDestinationAddress}&travelmode=driving`;
  
      // Open Google Maps in a new tab
      window.open(mapsUrl, '_blank');
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };
  
    return (

        <div className={styles.itineraryArrOfItemsContainer}>
          <div className={styles.utilitySection}>
            <button className={styles.shareItineraryButton}>share</button>
            <button className={styles.addItineraryItemButton}>+</button>
         </div> 
        { itineraryItems.map((itineraryItem: ItineraryItem) => (
            <div key={uuidv4()} className={styles.itineraryParent}>
                <div className={styles.mainItinItemContainer}>
                <div className={styles.startTime}>
                    {itineraryItem.startTime}
                </div>
                <div className={styles.itinTitleContainer}>
                    <h2 className={styles.itinTitle}>{itineraryItem.venue}</h2>
                    <div className={styles.belowTitleCaretContainer}
                    onClick={()=>handleShowHideDescription(itineraryItem)}
                    >
                       {caretDown2}
                    </div>
                </div>
                <div className={styles.hamburgerMenuContainer}>
                    {ellipsisVertical}
                </div>
            </div>
  {/* ////////////////////////////////////////////////////////////////////////////       */}
            <div className={`${styles.expandedItinItemContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>

                  
                  <div className={styles.expandedMidTextWrapper}>
                    <div className={styles.expandedMidTextSection}>
                        <div className={styles.expandedItinItemText}
                        onClick={()=>handleShowHideDescription(itineraryItem)}
                        >
                          {itineraryItem.description}
                        </div>
                        <div className={styles.expandedItinBudgetContainer}
                        onClick={()=>handleShowHideDescription(itineraryItem)}
                        >
                            Budget: {itineraryItem.perPersonAverageBudget}
                        </div>
                        <div className={styles.expandedItinAddressContainer}
                        onClick={()=>handleShowHideDescription(itineraryItem)}
                        >
                            Address: {itineraryItem.locationAddress}
                        </div>
                       
                    </div>
                    <div className={styles.expandedMidGroupingIndicator}></div>
                    <div className={styles.expandedMidGroupingRightEmpty}></div>
                  </div>
                  <div className={styles.expandedItinMapContainer}
                      onClick={()=>openGoogleMapsDirection(itineraryItem.locationAddress)}>

                          <div className={styles.expandedItinMapText}>Google Map Directions  </div>
                          <div className={styles.expandedItinMapIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"/><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"/><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"/><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"/><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"/></svg>
                          </div>       
                  </div>
                  <div className={styles.expandedItinItemWebsite}>
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(itineraryItem.venue)}`}  target="_blank">Search Venue on Google</a>
                  </div>

                  <div className={styles.youtubeLink}>
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(itineraryItem.venue.toString())}`} target="_blank">
                            Search Venue on YouTube</a>
                  </div>
            </div>
    </div>)
    )}
    </div>
    )
 
  };

export default Itinerary;