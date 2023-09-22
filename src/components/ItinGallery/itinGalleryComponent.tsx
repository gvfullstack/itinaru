import React from 'react';
import styles from './itinGalleryComponent.module.css';
import {useRouter} from 'next/router';
import QuillTextParserComponent from '../AppContolsComponents/quillTextParserComponent';

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

  const truncatedDescription = truncateText(props.description, 135);

  return (
    <div className={styles.container} onClick={() => router.push(`/viewPublicItinerary/${props.itinId}`)}>
      <div className={styles.image} style= {{ backgroundImage:`url(${props.imageUrl})`}}> </div>
      <div>
        <h5 className={styles.title}>{props.title}</h5>
        <p className={styles.text}>{props.city}, {props.state}</p>
        <div className={styles.text}>
           <QuillTextParserComponent description={truncatedDescription}/>
        </div>
        {/* <p className={styles.text}>{props.description}</p> */}
        {/* <p className={styles.text}><strong>Duration:</strong> {duration}</p> */}
      </div>
    </div>
  );
};

export default ItinGalleryComponent;
