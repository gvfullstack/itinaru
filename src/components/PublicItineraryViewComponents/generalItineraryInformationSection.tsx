import React, { FC, useState } from 'react';
import styles from './publicItineraryView.module.css'
import {currentlyViewingItineraryState} from './publicItinViewAtoms';
import {useRecoilState} from 'recoil';
import ItemDescriptionStaticComponent from './itemDescriptionStaticComponent';
import Image from 'next/image';
import { useRouter } from 'next/router';


type GeneralItineraryInformationProps = {
    summarySectionHidden: boolean;
};


const GeneralItineraryInformation: FC<GeneralItineraryInformationProps> = ({ summarySectionHidden }) => {
    const router = useRouter();
    
    const navigateToParentItinerary = () => {
        console.log('navigateToParentItinerary');
        if (itinerary?.derivedFromItineraryId) {
          router.push(`/viewItinerary/${itinerary.derivedFromItineraryId}`);
        }
      };
    
    const [itinerary, setItinerary] = useRecoilState(currentlyViewingItineraryState);
    const defaultUserImageUrl = 'https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/defaultAssets%2FuserSilhouette.svg?alt=media&token=98731ed6-dfc8-4e46-bdb1-1ce257f2f258';
    const defaultItinImageUrl = "https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/profilePictures%2FaOmGE5uedJTuxBTZGexTdOkUHbu1%2FprofilePicture?alt=media&token=3a432d96-92d0-40b2-8812-45f01462f078"

    return (
        <div className = {styles.generalItineraryInformationContainer}>
           {!summarySectionHidden && <div className={styles.itinGeneralInfoPhotoContainer}>
                {itinerary?.settings?.galleryPhotoUrl && 
                    <Image 
                        src={itinerary.settings?.galleryPhotoUrl ? itinerary.settings.galleryPhotoUrl : defaultItinImageUrl} 
                        alt="Itinerary Gallery Photo" 
                        width={2400} // replace with actual image width
                        height={2400} // replace with actual image height
                        loading='lazy'
                        className={styles.itinGeneralInfoPhoto}
                        style={{objectFit: 'cover'}}            
                    />
                    }
            
            </div>}

             {itinerary?.derivedFromItineraryId && (
                <p className={styles.derivedFromItineraryText}>
                Derived from a copy of {' '}
                <span 
                    className={styles.linkStyle} // Add styles to make it look like a link
                    onClick={navigateToParentItinerary}
                >
                    {itinerary.derivedFromItineraryId}
                </span>
                </p>
            )}
            
           <div className={styles.itinGeneralInfoTextSectionWIthCopyButton}> 
                <div className={styles.itinGeneralInfoTextSection}>
                <div  
                      className={styles.aspectRatioBox2}
                      onClick={(e) => {
                        e.stopPropagation(); // This stops the event from bubbling up to the parent
                        router.push(`/user/${itinerary?.uid}/publicUserProfileLoading`);
                      }}                  >
                    {itinerary?.profilePictureUrl ? (
                      <Image
                        src={itinerary?.profilePictureUrl}
                        alt="User profile picture"
                        width={2400}
                        height={2400}
                        loading='lazy'
                        // style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className = {styles.profilePicture}
                        title='Visit User profile page'
                      />
                    ) : (
                      <img
                        src={defaultUserImageUrl} // URL of your SVG
                        alt="No image uploaded by creator."
                        title='Visit User profile page'
                        className = {styles.profilePicture}
                      />
                    )}
                  </div>
                    <p className={styles.publicItinViewTitle}>{itinerary?.settings?.title }</p>
                    <p>{itinerary?.settings?.city || 'CITY MISSING'}, {itinerary?.settings?.state || 'STATE MISSING'}</p>
                </div>
            </div>
                
            {!summarySectionHidden && <div className={styles.itinTitleDescription}>
                <ItemDescriptionStaticComponent description={itinerary?.settings?.description ?? ''} />
            </div>  
                } 
          
        </div>
    );
  };
  
  export default GeneralItineraryInformation;


  