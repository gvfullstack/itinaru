import React, { useRef, useState, useEffect, Ref, forwardRef, useImperativeHandle } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItineraryItem, ItemTypes, Itinerary} from '../editFormTypeDefs';
const { v4: uuidv4 } = require('uuid');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faDiamondTurnRight, faEllipsisVertical, 
  faStopwatch, faTrash, faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from 'recoil';
import getConfig from 'next/config';
import styles from'.././EditFormCSS/editItineraryCSS.module.css'
import styles2 from'.././EditFormCSS/itineraryEditForm.module.css'
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';
import dayjs from 'dayjs'; 
import StaticStarRating from './StaticStarRating';

const externalLink = <FontAwesomeIcon icon={faExternalLinkAlt} />;
const mapMarkerAlt = <FontAwesomeIcon icon={faDiamondTurnRight} />;
const ellipsisVertical = <FontAwesomeIcon icon={faEllipsisVertical} />;
const clock = <FontAwesomeIcon icon={faStopwatch} />;
const deleteItemIcon = <FontAwesomeIcon icon={faTrash} />;
const editItemIcon = <FontAwesomeIcon icon={faPenToSquare} />;


import { currentlyEditingItineraryState } from '../editFormAtoms';
import dynamic from 'next/dynamic';
const GoogleMapsProvider = dynamic(() => 
    import('../EditFormITEMComponents/googleMapsProvider'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });
const ItineraryItemForm = dynamic(() => 
    import('../EditFormITEMComponents/itineraryItemForm'), {
    ssr: false,
    loading: () => <p>Loading...</p>
    });

interface DraggableItineraryItemProps {
  id: string;
  itineraryItem: ItineraryItem;
  style?: React.CSSProperties; // Add the style prop
}

const EFDraggable = React.forwardRef((
  { id, itineraryItem, style }: DraggableItineraryItemProps,
  forwardedRef: Ref<HTMLDivElement> // specify the type of the ref
  ) => {

  const [itineraryInEdit, setItineraryInEdit]= useRecoilState<Itinerary>(currentlyEditingItineraryState);
  const itemStyles = {...styles, ...style}
  const localRef = useRef<HTMLDivElement>(null);
  const [showDescription, setShowDescription] = useState(false);
  useEffect(() => {console.log(showDescription)}, [showDescription]);
  
  const handleShowHideDescription = () => {
    setItineraryInEdit(prevItinerary => {
        const updatedItems = prevItinerary.items?.map((item) => {
            if (item.id === itineraryItem.id) {
                return { ...item, descHidden: !item.descHidden };
            }
            return item;
        });

        return {
            ...prevItinerary,
            items: updatedItems
        };
    });
}
//   const handleShowHideDescription = () => {
//     setItineraryInEdit(prevItinerary => {
//       console.log("prevItinerary", prevItinerary)
//         const updatedItems = prevItinerary.items.map((item) => {
//             if (item.id === itineraryItem.id) {
//                 return { ...item, descHidden: !item.descHidden };
//             }
//             return item;
//         });

//         return {
//             ...prevItinerary,
//             items: updatedItems
//         };
//     });
// }
  
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
const formattedEndTime = formatTimeWithoutSeconds(itineraryItem.endTime?.time?? new Date());
const formattedStartTime = formatTimeWithoutSeconds(itineraryItem.startTime?.time?? new Date());


 const handleRemoveClick = () => {
  const index = itineraryInEdit.items?.findIndex((item) => item.id === itineraryItem.id);
  if (index !== -1 && index !== undefined) {
    const newItems = [...(itineraryInEdit.items || [])];
    newItems.splice(index, 1);
    setItineraryInEdit((prev: Itinerary) => ({ ...prev, items: newItems }));
  }
};
  
  const Menu = () => {
    return (
      <div className={`${styles.menu} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
        <div className={styles.menuItem} onClick={handleShowItemForm}>{editItemIcon} Edit</div>
        <div className={styles.menuItem} >
        <a
          href={mapsUrl || undefined}
          target={mapsUrl ? "_blank" : undefined}
          rel={mapsUrl ? "noopener noreferrer" : undefined} // important for security
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
        <div className={styles.menuItem} onClick={handleRemoveClick}>{deleteItemIcon} Delete</div> 
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


  // function millisecondsToHoursMinutes(ms:number | undefined | null): string {
  //   ms = ms ?? 0;
  //   const totalMinutes = Math.floor(ms / 60000);
  //   const hours = Math.floor(totalMinutes / 60);
  //   const minutes = totalMinutes % 60;
  //   return `${hours}:${minutes.toString().padStart(2, '0')}`;
  // }

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
  
  let mapsUrl: string | null = null;

  if (itineraryItem.locationAddress) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${itineraryItem.itemTitle || ""} ${itineraryItem.locationAddress || ""}`)}`;
  } else if (itineraryItem.location && itineraryItem.location.latitude && itineraryItem.location.longitude) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${itineraryItem.location.latitude},${itineraryItem.location.longitude}`;
  }
 
  return (
    <>
 
    <div ref={localRef} style={itemStyles}  className={styles.dropDiv} >
    {showItemForm && 
      <div className={styles2.modalOverlay}>
        <div className={styles2.modalContent}>
              <GoogleMapsProvider>
                <ItineraryItemForm 
                  handleShowItemForm={handleShowItemForm} 
                  mode="edit"
                  initialItem={itineraryItem}
                  handleRemoveClick={handleRemoveClick}
                    />
              </GoogleMapsProvider>
        </div>
       </div> 
           }
        <div key={uuidv4()} className={`${styles.itineraryParent} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
             <div className={styles.mainItinItemContainer}>
                  <div className={`${styles.itineraryItemContainerContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                      {/* <div className={styles.itinTitleContainer}> */}
                          <h3 className={`${styles.itinTitle} ${itineraryItem.descHidden ? "" : styles.isShown}`} 
                            onClick={()=>handleShowHideDescription()}>
                              {itineraryItem.descHidden ? shortItemTitle : itineraryItem.itemTitle}                           
                            </h3>
                            <div className={`${styles.activityTime} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                                    <div className={`${styles.infoBannerWords} ${itineraryItem.descHidden ? "" : styles.isShown}`}>Start:</div>
                                    <div className={styles.startTimeContainer}>
                                      <div className={`${styles.startTime} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                                          <div>  
                                            {formattedStartTime}
                                          </div>
                                      </div>
                                    </div>
                                    <div className={`${styles.infoBannerWords} ${itineraryItem.descHidden ? "" : styles.isShown}`}>End:</div>
                                    <div className={styles.endTimeContainer}>
                                      <div className={`${styles.endTime} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                                            <div>
                                              {formattedEndTime}
                                            </div>
                                      </div>
                                    </div>
                                    <div className={`${styles.infoBannerWords} ${itineraryItem.descHidden ? "" : styles.isShown}`}>Duration:</div>

                                    <div className={`${styles.durationContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`}>
                                      {minutesToHoursMinutes(itineraryItem.activityDuration)}&nbsp;{clock}
                                    </div>
                                    <div 
                                      className={`${styles.expandedItinMapText} ${itineraryItem.descHidden ? "" : styles.isShown}`} 
                                                                >
                                          <a
                                            href={mapsUrl || undefined}
                                            target="_blank"
                                            style={{ textDecoration: 'none', color: 'black' }}
                                            >{mapMarkerAlt}</a>
                                                
                                    </div>
                          </div> 
                            <div className={`${styles.itinTitleDescription} ${itineraryItem.descHidden ? "" : styles.isShown}`}>  
                               <ItemDescriptionStaticComponent description={itineraryItem.description || ""} />
                            </div>                       
                          
                          <p className={`${styles.expandedItinAddressContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>{itineraryItem.locationAddress}</p>
                          {itineraryItem.location?.latitude && itineraryItem.location?.longitude &&
                            <p className={`${styles.expandedItinAddressContainer} ${itineraryItem.descHidden ? "" 
                            : styles.isShown }`}>{itineraryItem.location?.latitude}, {itineraryItem.location?.longitude}
                            </p>
                          }
                         
                          <div className={`${styles.ownResearchContainer} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
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
                            <StaticStarRating starRating={itineraryItem.rating}/>

                            <div className={`${styles.expandedMenu} ${itineraryItem.descHidden ? "" : styles.isShown }`}>
                              <div className={styles.expandedMenuItem} onClick={handleShowItemForm}>{editItemIcon} Edit</div>
                              <div className={styles.expandedMenuItem} >
                                <a
                                  href={mapsUrl || undefined}
                                  target={mapsUrl ? "_blank" : undefined}
                                  rel={mapsUrl ? "noopener noreferrer" : undefined} // important for security
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
                              <div className={styles.expandedMenuItem} onClick={handleRemoveClick}>{deleteItemIcon} Delete</div> 
                            </div>
                          </div>
                  
                        
                          <div 
                            className={`${styles.hamburgerMenuContainer} ${itineraryItem.descHidden ? "" : styles.isShown}`} 
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

EFDraggable.displayName = 'DraggableItineraryItem';

export default EFDraggable;
