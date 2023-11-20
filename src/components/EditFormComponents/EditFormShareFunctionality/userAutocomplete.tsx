import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, useHits, Configure } from 'react-instantsearch';
import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { searchUserResultsState, searchUserQueryState, 
  currentlyEditingItineraryState, itineraryAccessItinView } from '../editFormAtoms'; // Replace with your own Recoil atoms for users
import Image from 'next/image';
import styles from './EFshareContainer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Itinerary, UserAccessWithDocId,ItineraryAccess } from '../editFormTypeDefs';
import {saveUserAccessToFirebase}  from './utils/saveUserAccessToFirebase ';

const appId: string = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
if (!appId) {
    throw new Error("Algolia App ID not found");
}
const searchKey: string = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
if (!searchKey) {
    throw new Error("Algolia App ID not found");
}

const searchClient = algoliasearch(appId, searchKey);

type AlgoliaUser = {
    objectID: string;
    email?: string;
    username?: string;
    profilePictureUrl?: string;
  };

  const UserAutocomplete: React.FC = () => {
      const [searchQuery, setSearchQuery] = useRecoilState(searchUserQueryState);
      const setSearchResults = useSetRecoilState(searchUserResultsState);
      const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);

    return (
      <InstantSearch searchClient={searchClient} indexName="users">
        <Configure
          attributesToRetrieve={[
            'objectID',
            'email',
            'username',
            'profilePictureUrl',
          ]}
          query={searchQuery}
          filters={`NOT objectID:${itinerary.uid}`} // do not show the itinerary owner in the search results
        />
  
        <UserInput />
  
        {searchQuery &&<UserResults setSearchResults={setSearchResults} />}
      </InstantSearch>
    );
  };
  
  const UserInput: React.FC<{}> = ({}) => {
    // const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useRecoilState(searchUserQueryState);


    const addContributorIcon = (
        <FontAwesomeIcon
            icon={faUserPlus}
            className={styles.addContributorIcon}
        />
      )
    const faXmarkIcon = (
      <FontAwesomeIcon 
          icon={faXmark} 
          className={styles.faXmarkInner} 
          type="button" 
          onClick={()=>{
            // setInputValue(''); 
            setSearchQuery('')}}
      />
    );

    return (
        <div className={styles.searchContainer}>
            {addContributorIcon}
            <input
                className={styles.searchInput}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                // setInputValue(e.target.value);
                setSearchQuery(e.target.value);
                }}
                placeholder="Search users..."
            />
              {faXmarkIcon}
        </div>


    );
  };
  
  const UserResults: React.FC<{ setSearchResults: React.Dispatch<React.SetStateAction<any[]>> }> = ({ setSearchResults }) => {
    const { hits }: { hits: AlgoliaUser[] } = useHits();
    const [searchQuery, setSearchQuery] = useRecoilState(searchUserQueryState);
  
    useEffect(() => {
      setSearchResults(hits);
    }, [hits]);
  
    const [itinerary, setItinerary] = useRecoilState<Itinerary>(currentlyEditingItineraryState);
    const [itineraryAccessState, setItineraryAccessState] = useRecoilState<ItineraryAccess>(itineraryAccessItinView);

      const handleUpdateAccess = (user: UserAccessWithDocId) => {
        const userAlreadyExists = itineraryAccessState.some(existingUser =>
          existingUser.uid === user.uid && existingUser.itineraryId === user.itineraryId
        );
        if (!userAlreadyExists) {
          saveUserAccessToFirebase(user, setItineraryAccessState, itinerary.id);
        }
        setSearchQuery('');
      };

      function stripHtmlTags(str: string): string {
        if (!str) return ""; // Return an empty string instead of false
        return str.replace(/<[^>]*>/g, '');
      }

      const truncateText = (text: string, maxLength: number) => {

        if(!text) return "";
        if (text.length > maxLength) {
          text = stripHtmlTags(text);
          // Cut the text and add ellipsis
          return text.substring(0, maxLength - 3) + "...";
        }
        return text;
      };

      const onClickFunction = (hit: AlgoliaUser) => {
        return () => {
          const description = truncateText(itinerary.settings?.description || '', 135);
          const transformedUser: UserAccessWithDocId = {
            uid: hit.objectID,
            role: 'viewer',
            itineraryId: itinerary.id,
            ...(hit.email ? { email: hit.email } : {}),
            ...(hit.username ? { username: hit.username } : {}),
            ...(hit.profilePictureUrl ? { profilePictureUrl: hit.profilePictureUrl } : {}),
            ...(itinerary.settings?.title ? { title: itinerary.settings?.title } : {}),
            ...(itinerary.settings?.neighborhood ? { neighborhood: itinerary.settings?.neighborhood } : {}),
            ...(itinerary.settings?.city ? { city: itinerary.settings?.city } : {}),
            ...(itinerary.settings?.state ? { state: itinerary.settings?.state } : {}),
            ...(itinerary.settings?.galleryPhotoUrl ? { galleryPhotoUrl: itinerary.settings?.galleryPhotoUrl } : {}),
            visibility: itinerary.settings?.visibility ?? 'private', // This sets a default value of 'private'
            isDeleted: false,
          };
          handleUpdateAccess(transformedUser);
        };
      };

    return (
      <div className = {styles.mainResultsDiv}>
        {hits.map((hit, index) => (
         <div key={index} className={styles.ResultsContainer} onClick={onClickFunction(hit)}>
            {hit.profilePictureUrl ? (
                
            <div className={styles.profilePicImageContainer}>
                <Image 
                    src={hit.profilePictureUrl} 
                    alt="User Profile Picture" 
                    width={50} 
                    height={50}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}            

                />
            </div>
         
         ) : 
            (
                <div className={styles.name}>
                    {(hit.username && hit.username[0]) || (hit.email && hit.email[0]) || (hit.objectID && hit.objectID[0])}
                </div>
            )}
            <div className={styles.nameIdentifier}>
                {hit.email || hit.username || hit.objectID}
            </div>
          </div>
        ))}
      </div>
    );
  };
  

export default UserAutocomplete;
