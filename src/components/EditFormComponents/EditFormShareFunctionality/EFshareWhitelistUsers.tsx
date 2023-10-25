import React, { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { currentlyEditingItineraryState, itineraryAccessItinView } from '../editFormAtoms';
import { Itinerary, UserAccessWithDocId, ItineraryAccess } from '../editFormTypeDefs';
import styles from './EFshareContainer.module.css';
import Image from 'next/image';
import {updateUserRoleInFirebase}  from './utils/updateUserRoleInFirebase ';


interface ShareContainerProps {
  accessType: 'readAccess' | 'editAccess';
}

const ShareWhitelistUsers: React.FC<ShareContainerProps> = ({ accessType }) => {
  const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
  const [itineraryAccessState, setItineraryAccessState] = useRecoilState<ItineraryAccess>(itineraryAccessItinView);
  const reducedAccessList = useMemo(() => {
    if (accessType === 'readAccess') {
      return itineraryAccessState?.filter(user => user.role === 'viewer');
    } else {
      return itineraryAccessState?.filter(user => user.role === 'editor');
    }
  }, [itineraryAccessState, accessType]);

  const handleRoleAndAccessUpdate = (e: React.ChangeEvent<HTMLSelectElement>, user: UserAccessWithDocId) => {

    const newRole = e.target.value as 'viewer' | 'editor' | 'delete'; // Explicitly define role type
   
    if (newRole === 'delete') {
      setItineraryAccessState(prev => prev.filter(userAccess => userAccess.uid !== user.uid));    

    }
    else {
      setItineraryAccessState((prev: ItineraryAccess) => {
        return prev.map((userAccess) => { // map through the previous ItineraryAccess array
          if (userAccess.uid === user.uid) {
            return {
              ...userAccess,
              role: newRole,
            };
          }
          return userAccess;
        });
      });       
    }

    if(user.docId){
    updateUserRoleInFirebase(user.docId, newRole);}
    
  };
  

  return (
    <div className = {styles.shareWhirelistUserContainer}>

      {reducedAccessList ?.map((user, index) => (
        <div key={index} className={styles.ResultsContainer}>
            {user.profilePictureUrl ? (
                
            <div className={styles.profilePicImageContainer}>
                <Image 
                    src={user.profilePictureUrl} 
                    alt="User Profile Picture" 
                    width={50} 
                    height={50}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}            

                />
            </div>
        
        ) : 
            (
                <div className={styles.name}>
                    {(user.username && user.username[0]) || (user.email && user.email[0]) || (user.uid && user.uid[0])}
                </div>
            )}
        <div className={`${styles.nameIdentifier} ${styles.usersDisplay}`}>
                {user.email || user.username || user.uid}
            </div>
            {accessType == 'readAccess'? 
            <select onChange={(e) => handleRoleAndAccessUpdate(e, user)} className={styles.select} value={user.role}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="delete">Remove</option>
            </select>:
            <select onChange={(e) => handleRoleAndAccessUpdate(e, user)} className={styles.select} value='editor'>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="delete">Remove</option>
            </select>
            }

        </div>

        ))}
    </div>
  );
};

export default ShareWhitelistUsers;
