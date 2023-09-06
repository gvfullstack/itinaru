import React, { useRef, useState, useEffect, Ref, forwardRef, useImperativeHandle } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItineraryItem, ItemTypes } from '../editFormTypeDefs';
const { v4: uuidv4 } = require('uuid');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { itineraryItemsState, tripPreferencesAtom, userPreferencesAtom} from '../../../atoms/atoms';
import getConfig from 'next/config';
import styles from '../aiItinBuilderCSS/itinerary.module.css';

const externalLink = <FontAwesomeIcon icon={faExternalLinkAlt} />;
const mapMarkerAlt = <FontAwesomeIcon icon={faDiamondTurnRight} />;
const ellipsisVertical = <FontAwesomeIcon icon={faEllipsisVertical} />;

interface DraggableItineraryItemProps {
  id: string;
  itineraryItem: ItineraryItem;
  handleShowHideDescription: (curItineraryItem: ItineraryItem) => void;
  style?: React.CSSProperties; // Add the style prop
}



const EditFormDraggableItineraryItem = React.forwardRef((
  { id, itineraryItem, handleShowHideDescription, style }: DraggableItineraryItemProps,
  forwardedRef: Ref<HTMLDivElement> // specify the type of the ref
) => {
  const itemStyles = {...styles, ...style}

  const localRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITINERARY_ITEM,
    item: itineraryItem,
    beginDrag: () => ({ itineraryItem }), 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),  
    }),
  }));

  drag(localRef); // use the local ref with the drag function

  useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);                    

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
  const [userPreferences, setUserPreferences] = useRecoilState(userPreferencesAtom);

  const [itineraryItemsInState, setItineraryItemsInState] = useRecoilState<ItineraryItem[]>(itineraryItemsState);


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
    
  const handleRemoveClick = () => {
    const index = itineraryItemsInState.findIndex((item) => item.id === itineraryItem.id);
    if (index !== -1) {
      const newItems = [...itineraryItemsInState];
      newItems.splice(index, 1);
      setItineraryItemsInState(newItems);
    }
  };
  
  
  const Menu = () => {
    return (
      <div className={`${styles.menu} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
        <div className={styles.menuItem} onClick={handleRemoveClick}>Remove</div>
        <div className={styles.menuItem} >Edit</div>
        <div className={styles.menuItem} >
              <a
              href={
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itineraryItem.locationAddress)
              }`}
              target="_blank"
              style={{ textDecoration: 'none', color: 'black' }}
              >
              Directions
              </a>  
        </div>
      </div>
    );
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    setMenuOpen(!menuOpen);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
  
    document.addEventListener("click", handleOutsideClick);
  
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  function millisecondsToHoursMinutes(ms:number | undefined | null): string {
    ms = ms ?? 0;
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

  return (
    <div ref={localRef} style={itemStyles}  className={styles.dropDiv} >
      <div key={uuidv4()} className={`${styles.itineraryParent} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
             <div className={styles.mainItinItemContainer}>
                  <div className={styles.itineraryItemContainerContainer}>
                      <div className={styles.itinTitleContainer} 
                      >
                          <h3 className={`${styles.itinTitle} ${itineraryItem.descHidden ? "" : styles.isShown }`} onClick={()=>handleShowHideDescription(itineraryItem)}>{itineraryItem.siteName}</h3>
                          <p className={`${styles.itinTitleDescription} ${itineraryItem.descHidden ? "" : styles.isShown }`}> {itineraryItem.description} </p>
                          <p className={`${styles.expandedItinAddressContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>{itineraryItem.locationAddress}</p>
                          <div className={`${styles.ownResearchContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
                            Do your own research: 
                            <div className={styles.expandedItinItemWebsite}>
                              <a href={`https://www.google.com/search?q=${encodeURIComponent(itineraryItem.siteName ? itineraryItem.siteName : "")} ${encodeURIComponent(tripPreferences.destination ? tripPreferences.destination : "")}`} target="_blank">
                                {externalLink}
                                <span className={styles.youGSearchText}>Search on Google</span>
                              </a>
                            </div>

                            <div className={styles.youtubeLink}>      
                                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(itineraryItem.siteName ? itineraryItem.siteName : "")} ${encodeURIComponent(tripPreferences.destination ? tripPreferences.destination : "")}`} target="_blank">
                                  {externalLink} <span className={styles.youTubeLinkText}>Search on YouTube</span></a>
                            </div>
                          </div>
                      </div>
                      
                      <div className={`${styles.rightContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                        <div className={styles.activityTime}>
                                <div className={styles.startTimeContainer}>
                                    <div className={styles.startTime}>
                                          <div onClick={()=>handleTimeEditStatus("startTime")}>  
                                            {formattedStartTime}
                                          </div>
                                    </div>
                                  </div>
                                    <div className={styles.endTimeContainer}>
                                    <div className={styles.endTime}>
                                          <div onClick={()=>handleTimeEditStatus("endTime")}>
                                            {formattedEndTime}
                                          </div>
                                    </div>
                                  </div>
                                      <div className={styles.durationContainer}>
                                        DURATION: {millisecondsToHoursMinutes(itineraryItem.activityDuration)}
                                      </div>
                                      {itineraryItem.userDefinedRespectedTime && 
                                        <div className={styles.durationContainer}>
                                          TIME LOCKED
                                        </div>
                                      }
                          </div> 
                        <div 
                          className={`${styles.hamburgerMenuContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`} 
                          onClick={handleMenuClick} 
                          ref={menuRef}>
                                    {ellipsisVertical}
                                    {menuOpen && <Menu />}
                        </div>
                        <div 
                          className={`${styles.expandedItinMapText} ${itineraryItem.descHidden ? "" : styles.isShown}`} 
                                                     >
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itineraryItem.locationAddress)}`}
                                target="_blank"
                                style={{ textDecoration: 'none', color: 'black' }}
                                >{mapMarkerAlt}</a>
                                    
                        </div>                             
                      </div>
              </div>
          </div>
      </div>
    </div>
  ); 
},);

EditFormDraggableItineraryItem.displayName = 'DraggableItineraryItem';

export default EditFormDraggableItineraryItem;





const openMapsDirection = async (destinationAddress?: string) => {
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

    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${encodedDestinationAddress}&travelmode=driving`;

    // Open Maps in a new tab
    if (typeof window !== 'undefined') {
      window.open(mapsUrl, '_blank');
    } else {
      console.error('window is not defined');
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }
};