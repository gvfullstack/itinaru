import React, { useRef, useState, useEffect} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItineraryItem, ItemTypes } from './typeDefs';
import styles from '../components/itinBuilderCSS/itinerary.module.css';
const { v4: uuidv4 } = require('uuid');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { itineraryItemsState, tripPreferencesAtom } from '../atoms/atoms';
import ResponsiveTimePicker from './responsiveTimePicker';
import axios from 'axios';
import getConfig from 'next/config';


const externalLink = <FontAwesomeIcon icon={faExternalLinkAlt} />;
const mapMarkerAlt = <FontAwesomeIcon icon={faDiamondTurnRight} />;
const ellipsisVertical = <FontAwesomeIcon icon={faEllipsisVertical} />;

interface DraggableItineraryItemProps {
  id: string;
  itineraryItem: ItineraryItem;
  handleShowHideDescription: (curItineraryItem: ItineraryItem) => void;
}

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
    if (typeof window !== 'undefined') {
      window.open(mapsUrl, '_blank');
    } else {
      console.error('window is not defined');
    }
    } catch (error) {
    console.error('Error getting user location:', error);
  }
};

const DraggableItineraryItem: React.FC<DraggableItineraryItemProps> = ({ 
  id, itineraryItem, handleShowHideDescription  }) => {

  const [{ isDragging }, drag] = useDrag(() => ({ // Add isDragging to the array
    type: ItemTypes.ITINERARY_ITEM,
    item: itineraryItem,
    beginDrag: () => ({ itineraryItem }), 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),  
    }),
  }));

  const itemStyle = {
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100000 : 1,
  
  };

  function formatTimeWithoutSeconds(date: Date): string {
    if (isNaN(date.getTime())) {
      return "";
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  
    return formatter.format(date)
  }

  const formattedStartTime = formatTimeWithoutSeconds(itineraryItem.startTime?.time?? new Date());
  const formattedEndTime = formatTimeWithoutSeconds(itineraryItem.endTime?.time?? new Date());
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom);

  const [itineraryItemsInState, setItineraryItemsInState] = useRecoilState<ItineraryItem[]>(itineraryItemsState);

  function convertDateToTimeInputValue(date: Date) {
    if (isNaN(date.getTime())) {
      return "";
    }
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return localDate.toISOString().substring(11, 16);
  }

  const handleTimeEditStatus = (propertyName: "startTime" | "endTime") => {
    const index = itineraryItemsInState.findIndex(item => item.id === itineraryItem.id);
    const updatedItem = {
      ...itineraryItem,
      [propertyName]: {
        ...itineraryItem[propertyName],
        beingEdited: !itineraryItem[propertyName]?.beingEdited, 
      },
      [propertyName === "startTime" ? "endTime": "startTime"]: {
          ...itineraryItem[propertyName === "startTime" ? "endTime": "startTime"],
          beingEdited: false, 
        },
    };
    const newItems = [...itineraryItemsInState];
    newItems[index] = updatedItem;

    const newItemsWithFalseBeingEdited = newItems.map((item: ItineraryItem) => {
      if (item.id !== itineraryItem.id) {
        return {
          ...item,
          startTime: {
            ...item.startTime,
            beingEdited: false,
            time: item.startTime?.time ?? new Date()
          },
          endTime: {
            ...item.endTime,
            beingEdited: false,
            time: item.endTime?.time ?? new Date()
          }
        };
      }
      return item;
    });
    
    setItineraryItemsInState(newItemsWithFalseBeingEdited);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };
    
  const handleRemoveClick = () => {
    const index = itineraryItemsInState.findIndex((item) => item.id === itineraryItem.id);
    if (index !== -1) {
      const newItems = [...itineraryItemsInState];
      newItems.splice(index, 1);
      setItineraryItemsInState(newItems);
    }
  };
  
  const [replacementLoading, setReplacementLoading] = useState(false);
 
  useEffect(() => {
    console.log(itineraryItemsInState);
  }, [itineraryItemsInState]);
  
  const handleReplaceClick = () => {
    setTripPreferences((prevState) => ({
      ...prevState,
      specificSitesToExclude: [...(prevState.specificSitesToExclude || []), itineraryItem.activityTitle].filter(Boolean) as string[],
    }));
    setReplacementLoading(true);
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.BASE_URL;

    axios.post(baseUrl +'/api/replacement/replacement', 
    {
      itineraryItem: itineraryItem,
      tripPreferences: tripPreferences || [] 
    }

    ) 
    .then((response) => { 
      console.log("success", response.data.replacement);
      const index = itineraryItemsInState.findIndex(item => item.activityTitle === itineraryItem.activityTitle);
      const updatedItem = response.data.replacement[0];
      console.log("updatedItem", updatedItem);
      const updatedItems = [...itineraryItemsInState];
      if (index !== -1) {
        const { startTime, endTime } = itineraryItemsInState[index];
        updatedItems[index] = {
          ...updatedItem,
          startTime,
          endTime,
        };
      }
        console.log(itineraryItemsInState)
      setItineraryItemsInState(updatedItems);
      }).catch((error) => {
        console.log("error", error);
      }).finally(() => {setReplacementLoading(false)});
  
    };


  const Menu = () => {
    return (
      <div className={`${styles.menu} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
        <div className={styles.menuItem} onClick={handleRemoveClick}>Remove</div>
        <div className={styles.menuItem} onClick = {handleReplaceClick}>Replace</div>
      </div>
    );
  };

  return (
    <div ref={drag} style={itemStyle}  className={styles.dropDiv} >
      <div key={uuidv4()} className={`${styles.itineraryParent} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
             <div className={styles.mainItinItemContainer}>
                  <div className={styles.itineraryItemContainerContainer}>
                      <div className={styles.itinTitleContainer} 
                      >
                          <h3 className={`${styles.itinTitle} ${itineraryItem.descHidden ? "" : styles.isShown }`} onClick={()=>handleShowHideDescription(itineraryItem)}>{replacementLoading ? "...processing" : itineraryItem.activityTitle}</h3>
                          <p className={`${styles.itinTitleDescription} ${itineraryItem.descHidden ? "" : styles.isShown }`}> {replacementLoading ? "" : itineraryItem.description} </p>
                          <p className={`${styles.expandedItinAddressContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>{replacementLoading ? "" : itineraryItem.locationAddress}</p>
                          <p className={`${styles.ownResearchContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
                            Do your own research: 
                            <div className={styles.expandedItinItemWebsite}>
                              <a href={`https://www.google.com/search?q=${encodeURIComponent(itineraryItem.activityTitle ? itineraryItem.activityTitle : "")} ${encodeURIComponent(tripPreferences.destination ? tripPreferences.destination : "")}`} target="_blank">
                                {externalLink}
                                <span className={styles.youGSearchText}>Search on Google</span>
                              </a>
                            </div>

                            <div className={styles.youtubeLink}>      
                                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(itineraryItem.activityTitle ? itineraryItem.activityTitle : "")} ${encodeURIComponent(tripPreferences.destination ? tripPreferences.destination : "")}`} target="_blank">
                                  {externalLink} <span className={styles.youTubeLinkText}>Search on YouTube</span></a>
                            </div>
                          </p>
                      </div>
                      
                      <div className={`${styles.rightContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                        <div className={styles.activityTime}>
                                <div className={styles.startTimeContainer}>
                                    <div className={styles.startTime}>
                                          {itineraryItem.startTime?.beingEdited ?
                                            <ResponsiveTimePicker
                                              propertyName="startTime"
                                              itineraryItem = {itineraryItem}
                                            />  
                                          :
                                          <div onClick={()=>handleTimeEditStatus("startTime")}>  
                                            {formattedStartTime}
                                          </div>}
                                    </div>
                                  </div>
                                    <div className={styles.endTimeContainer}>
                                    <div className={styles.endTime}>
                                          {itineraryItem.endTime?.beingEdited ? 
                                              <ResponsiveTimePicker
                                                propertyName="endTime"
                                                itineraryItem = {itineraryItem}
                                              /> 
                                          :
                                          <div onClick={()=>handleTimeEditStatus("endTime")}>
                                            {formattedEndTime}
                                          </div>}
                                    </div>
                                  </div>
                          </div> 
                        <div className={`${styles.hamburgerMenuContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`} onClick={handleMenuClick}>
                                    {ellipsisVertical}
                                    {menuOpen && <Menu />}
                        </div>
                        <div className={`${styles.expandedItinMapText} ${itineraryItem.descHidden ? "" : styles.isShown}`} onClick={()=>openGoogleMapsDirection(itineraryItem.locationAddress)}>
                                    {mapMarkerAlt}
                        </div>                             
                      </div>
              </div>
          </div>
      </div>
    </div>
  ); 
};

export default DraggableItineraryItem;