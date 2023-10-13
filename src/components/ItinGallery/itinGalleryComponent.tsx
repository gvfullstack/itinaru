import React from 'react';
import styles from './itinGalleryComponent.module.css';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../AppContolsComponents/quillTextParserComponent';
import Image from 'next/image';

type Props = {
  itinId: string,
  userId: string,
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
    <div className={styles.container} onClick={() => router.push(`/viewPublicItinerary/${props.itinId}`)}>
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
        <h5 className={styles.title}>{props.title}</h5>
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
