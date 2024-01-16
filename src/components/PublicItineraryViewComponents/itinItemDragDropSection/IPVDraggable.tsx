import React, { useRef, useState, useEffect, Ref, forwardRef, useImperativeHandle } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItineraryItem, ItemTypes, Itinerary} from '../publicItinViewTypeDefs';
const { v4: uuidv4 } = require('uuid');
import {DynamicFontAwesomeIcon} from '@/components';
import { faExternalLinkAlt, faDiamondTurnRight, faEllipsisVertical, 
  faStopwatch, faTrash, faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from 'recoil';
import styles from'./dragDrop.module.css'
import ItemDescriptionStaticComponent from '../itemDescriptionStaticComponent';
import dayjs from 'dayjs'; 

const externalLink = <DynamicFontAwesomeIcon className={styles.itinItemsIcons} icon={faExternalLinkAlt} />;
const mapMarkerAlt = <DynamicFontAwesomeIcon className={styles.itinItemsIcons} icon={faDiamondTurnRight} />;
const ellipsisVertical = <DynamicFontAwesomeIcon className={styles.itinItemsIcons} icon={faEllipsisVertical} />;
const clock = <DynamicFontAwesomeIcon className={styles.itinItemsIcons} icon={faStopwatch} />;

import {currentlyViewingItineraryState} from '../publicItinViewAtoms';
import dynamic from 'next/dynamic';
import { max } from 'lodash';
import StarRating from '../../EditFormComponents/ItinItemDragDropSection/StaticStarRating';

interface DraggableItineraryItemProps {
  id: string;
  itineraryItem: ItineraryItem;
  style?: React.CSSProperties; // Add the style prop
}

const IPVDraggable = React.forwardRef((
  { id, itineraryItem, style }: DraggableItineraryItemProps,
  forwardedRef: Ref<HTMLDivElement> // specify the type of the ref
  ) => {

  const [itineraryInEdit, setItineraryInEdit]= useRecoilState<Itinerary | null>(currentlyViewingItineraryState);
  const itemStyles = {...styles, ...style}
  const localRef = useRef<HTMLDivElement>(null);
  const [hideDescription, setHideDescription] = useState(true);

  const handleShowHideDescription = () => {
    setHideDescription(prev=>!prev)
}

  
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

  function formatTimeWithoutSeconds(date: dayjs.Dayjs | Date | null | undefined): 
  string {
    let valid = false;
    let formattedDate;

    if (date instanceof Date && !isNaN(date.getTime())) {
        valid = true;
        formattedDate = date;
    } else if (dayjs.isDayjs(date) && date.isValid()) {
        valid = true;
        formattedDate = date.toDate();
    }

    if (!valid) return "";

    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return formatter.format(formattedDate);
}
const formattedEndTime = formatTimeWithoutSeconds(itineraryItem.endTime?.time?? null);
const formattedStartTime = formatTimeWithoutSeconds(itineraryItem.startTime?.time?? null);

let mapsUrl: string | undefined = undefined;

if (itineraryItem.locationAddress) {
  mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${itineraryItem.itemTitle || ""} ${itineraryItem.locationAddress || ""}`)}`;
} else if (itineraryItem.location && itineraryItem.location.latitude && itineraryItem.location.longitude) {
  mapsUrl = `https://www.google.com/maps/search/?api=1&query=${itineraryItem.location.latitude},${itineraryItem.location.longitude}`;
}  
  const Menu = () => {
    return (
      <div className={`${styles.menu} ${hideDescription ? "" : styles.isShown }`}>
        <div className={styles.menuItem} >
          <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'black' }}
              onClick={(e) => {
                if (!mapsUrl) {
                  e.preventDefault(); // Prevent navigation when mapsUrl is not set
                }
              }}
            >
              {mapMarkerAlt}
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



  function minutesToHoursMinutes(minutes: number | undefined | null): string {
    minutes = minutes ?? 0;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
  }

  const [showItemForm, setShowItemForm] = useState(false);

  const handleShowItemForm = () => {
    setShowItemForm(prev=>!showItemForm);

  }


  const shortItemTitle = itineraryItem.itemTitle?.substring(0, 50) || "untitled item" + "...";

 

  return (
    <>
    <div ref={localRef} 
      style={itemStyles}  
      className={styles.dropDiv} 
      draggable={hideDescription ? "true" : "false"}
      >
      <div key={uuidv4()} className={`${styles.itineraryParent} ${hideDescription ? "" : styles.isShown }`}>
             <div className={styles.mainItinItemContainer}>
                  <div className={`${styles.itineraryItemContainerContainer} ${hideDescription ? "" : styles.isShown}`}>
                      {/* <div className={styles.itinTitleContainer}> */}
                          <h3 className={`${styles.itinTitle} ${hideDescription ? "" : styles.isShown}`} 
                            onClick={()=>handleShowHideDescription()}>
                              {hideDescription ? shortItemTitle : itineraryItem.itemTitle}                           
                            </h3>
                            <div className={`${styles.activityTime} ${hideDescription ? "" : styles.isShown}`}>
                                    <div className={`${styles.infoBannerWords} ${hideDescription ? "" : styles.isShown}`}>Start:</div>
                                    <div className={styles.startTimeContainer}>
                                      <div className={`${styles.startTime} ${hideDescription ? "" : styles.isShown}`}>
                                          <div>  
                                            {formattedStartTime}
                                          </div>
                                      </div>
                                    </div>
                                    <div className={`${styles.infoBannerWords} ${hideDescription ? "" : styles.isShown}`}>End:</div>
                                    <div className={styles.endTimeContainer}>
                                      <div className={`${styles.endTime} ${hideDescription ? "" : styles.isShown}`}>
                                            <div>
                                              {formattedEndTime}
                                            </div>
                                      </div>
                                    </div>
                                    <div className={`${styles.infoBannerWords} ${hideDescription ? "" : styles.isShown}`}>Duration:</div>

                                    <div className={`${styles.durationContainer} ${hideDescription ? "" : styles.isShown}`}>
                                      {minutesToHoursMinutes(itineraryItem.activityDuration)}&nbsp;{clock}
                                    </div>
                                    <div 
                                      className={`${styles.expandedItinMapText} ${hideDescription ? "" : styles.isShown}`} 
                                                                >
                                          <a
                                            href={mapsUrl}
                                            target="_blank"
                                            style={{ textDecoration: 'none', color: 'black' }}
                                            onClick={(e) => {
                                              if (!mapsUrl) {
                                                e.preventDefault(); // Prevent navigation when mapsUrl is not set
                                              }
                                            }}
                                            >{mapMarkerAlt}
                                            </a>
                                                
                                    </div>
                          </div> 
                            <div className={`${styles.itinTitleDescription} ${hideDescription ? "" : styles.isShown}`}>  
                               <ItemDescriptionStaticComponent description={itineraryItem.description || ""} />
                            </div>                       
                          {itineraryItem.locationAddress &&
                          <p className={`${styles.expandedItinAddressContainer} ${hideDescription ? "" : styles.isShown }`}>Address: <br/> 
                          {itineraryItem.locationAddress}
                          </p>}
                          {itineraryItem.location?.longitude && itineraryItem.location?.latitude &&
                          <p className={`${styles.expandedItinAddressContainer} ${hideDescription ? "" : styles.isShown }`}>Coordinates: <br/> 
                          {itineraryItem.location?.latitude}, {itineraryItem.location?.longitude}
                          </p>}
                          
                          <div className={`${styles.ownResearchContainer} ${hideDescription ? "" : styles.isShown }`}>
                            Do your own research: 
                            <div className={styles.expandedItinItemWebsite}>
                              <a href={`https://www.google.com/search?q=${encodeURIComponent(itineraryItem.itemTitle ? itineraryItem.itemTitle : "")}`} target="_blank">
                                {externalLink}
                                <span className={styles.youGSearchText}>Search on Google</span>
                              </a>
                            </div>

                            <div className={styles.youtubeLink}>      
                                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(itineraryItem.itemTitle ? itineraryItem.itemTitle : "")}`} target="_blank">
                                  {externalLink} <span className={styles.youTubeLinkText}>Search on YouTube</span></a>
                            </div>


                            <div className={styles.youtubeLink}>      
                            <a href={mapsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer">
                              {externalLink} <span className={styles.youTubeLinkText}>Search on Maps</span>
                            </a>
                            </div>


                            <StarRating starRating={itineraryItem.rating}/>
                          </div>
                  
                        
                          <div 
                            className={`${styles.hamburgerMenuContainer} ${hideDescription ? "" : styles.isShown}`} 
                            onClick={handleMenuClick} 
                            ref={menuRef}
                            >
                                      {ellipsisVertical}
                                      {menuOpen && <Menu />
                                      }
                          </div>
                                                       
              </div>
          </div>
      </div>
    </div>
    </>
  ); 
},);

IPVDraggable.displayName = 'DraggableItineraryItem';

export default IPVDraggable;
