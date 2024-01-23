import { useRouter } from 'next/router';
import styles from './PublicProfile.module.css';
import { AuthenticatedUser } from "@/components/typeDefs";
import BioComponent from './BioComponent';
import Image from 'next/image';
import UserItinerariesList from './UserItinerariesListComponent/userItinerariesListMainComponent';

type PublicProfileProps = {
    publicProfile: AuthenticatedUser | null; // Replace with the appropriate type
    userID: string;
  };

const PublicProfile: React.FC<PublicProfileProps> = ({ publicProfile, userID }) => {
 
  return (
    <div className={styles.profileStaticContainer}>
          {publicProfile?.profilePictureUrl && 
                <div className={styles.profilePicImageContainer}>
                  <Image 
                          src={publicProfile?.profilePictureUrl || ''} 
                          alt="user profile picture" 
                          width={512} // replace with actual image width
                          height={512} // replace with actual image height
                          loading='lazy'
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}            
                      />
                </div>}
          {publicProfile?.username && 
          <p className={styles.profileStaticFields}>Username: {publicProfile?.username}</p>}
          {publicProfile?.userFirstLastName && 
          <p className={styles.profileStaticFields}>First Name: {publicProfile?.userFirstLastName}</p>}          
          {publicProfile?.email &&
          <p className={styles.profileStaticFields}>Email: {publicProfile?.email}</p>}
          {publicProfile?.bio &&
          <div className={styles.profileStaticFieldsBio}>
             <BioComponent bio={publicProfile?.bio ?? ''} />
          </div>}
          <p className={styles.profileStaticFields}>Itineraries Curated by Me:</p>
          <UserItinerariesList userID = {userID}/>
    </div>
    
  );

};

export default PublicProfile;


