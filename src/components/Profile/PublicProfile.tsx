import { useRouter } from 'next/router';
import styles from './PublicProfile.module.css';
import { AuthenticatedUser } from "@/components/typeDefs";
import BioComponent from './BioComponent';


type PublicProfileProps = {
    publicProfile: AuthenticatedUser | null; // Replace with the appropriate type
  };

const PublicProfile: React.FC<PublicProfileProps> = ({ publicProfile }) => {
 
  return (
    <div className={styles.profileStaticContainer}>
          {publicProfile?.profilePictureUrl && <div className={styles.profilePicImageContainer}>
            <img src={publicProfile?.profilePictureUrl || ''} 
            alt=""
            className={styles.profilePicture}
            />      
          </div>}
          {publicProfile?.username && 
          <p className={styles.profileStaticFields}>Username: {publicProfile?.username}</p>}
          {publicProfile?.firstName && 
          <p className={styles.profileStaticFields}>First Name: {publicProfile?.firstName}</p>}
          {publicProfile?.lastName &&
          <p className={styles.profileStaticFields}>Last Name: {publicProfile?.lastName}</p>}
          {publicProfile?.phoneNumber &&
          <p className={styles.profileStaticFields}>Phone Number: {publicProfile?.phoneNumber}</p>}
          {publicProfile?.email &&
          <p className={styles.profileStaticFields}>Email: {publicProfile?.email}</p>}
          {publicProfile?.bio &&
          <div className={styles.profileStaticFieldsBio}>
             <BioComponent bio={publicProfile?.bio ?? ''} />
          </div>}
    </div>
    
  );
};

export default PublicProfile;

