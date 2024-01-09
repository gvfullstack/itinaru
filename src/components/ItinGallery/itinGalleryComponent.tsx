import React from 'react';
import styles from './itinGalleryComponent.module.css';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../AppContolsComponents/quillTextParserComponent';
import Image from 'next/image';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

type Props = {
  itinId: string,
  userId: string,
  profilePictureUrl?: string,
  title: string,
  description: string,
  neighborhood: string,
  city: string,
  state: string,
  duration: string,
  imageUrl: string,
}


const ItinGalleryComponent: React.FC<Props> = ({...props}) => {
  
  const router = useRouter();
  const defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/itinaru-6e85c.appspot.com/o/defaultAssets%2FuserSilhouette.svg?alt=media&token=98731ed6-dfc8-4e46-bdb1-1ce257f2f258';
  const truncateText = (text: string, maxLength: number) => {
    if(!text) return "";
    if (text.length > maxLength) {
      // Cut the text and add ellipsis
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const truncatedDescription = () => {
    return props.imageUrl ? 
      truncateText(props.description, 135) : 
      truncateText(props.description, 700);
  };

  const getRandomImage = () => {
    const images = ['dubaiShine.jpg', 'landscape.jpg', 'rainbow.jpg', 'sunflower.jpg', 'tropicalSunset.jpg'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `/images/homePageGalleryDefaultImages/${images[randomIndex]}`;
  };
  

  return (
    <div className={styles.container} onClick={() => router.push(`/viewItinerary/${props.itinId}`)}>
      <div className={styles.imageWrapper}>
      {props.imageUrl && <div className={styles.aspectRatioBox}> 
            <Image
              src={props.imageUrl || getRandomImage()} 
              alt="No image uploaded by creator."   
              width={2400}
              height={2400}
              loading='lazy'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}            
              />
          </div>}
      </div>
     
      <div>
        <div className={styles.titleContainer}>        
            <div className={styles.imageWrapper}
            >
                <div  
                      className={styles.aspectRatioBox2}
                      onClick={(e) => {
                        e.stopPropagation(); // This stops the event from bubbling up to the parent
                        router.push(`/${props.userId}`);
                      }}                  >
                    {props.profilePictureUrl ? (
                      <Image
                        src={props.profilePictureUrl}
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
                        src={defaultImageUrl} // URL of your SVG
                        alt="No image uploaded by creator."
                        className = {styles.defaultImage}
                        title='Visit User profile page'

                      />
                    )}
                  </div>
                </div>
            <h5 className={styles.title}>{props.title}</h5>
        </div>  
        <p className={styles.text}>{props.city}, {props.state}</p>
        <div className={styles.text}>
           <QuillTextParserComponent description={truncatedDescription()}/>
        </div>
        {/* <p className={styles.text}>{props.description}</p> */}
        {/* <p className={styles.text}><strong>Duration:</strong> {duration}</p> */}
      </div>
    </div>
  );
};

export default ItinGalleryComponent;
