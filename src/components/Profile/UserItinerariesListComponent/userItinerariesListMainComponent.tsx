import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import styles from './userItinerariesList.module.css';
import { useState, useRef, useEffect } from 'react';
import ItinGalCompWrapper from '../../ItinGallery/itinGalCompWrapper';
import algoliasearch from 'algoliasearch';
import CustomHits from './specificUserCustomHits';
import { useRecoilState } from 'recoil';
import {specificUserSearchQueryState} from '../UserProfileAtoms';

type PublicProfileProps = {
    userID: string;
  };

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
const searchClient = algoliasearch(appId, searchKey);

const UserItinerariesList: React.FC<PublicProfileProps> = ({ userID })=> {


    return (
        <div className={styles.container}>
            <InstantSearch searchClient={searchClient} indexName="itineraries">
                <Configure 
                    attributesToRetrieve={[
                        'id', 'uid', 'profilePictureUrl', 'settings.title', 'settings.description',
                        'settings.neighborhood', 'settings.city', 'settings.state',
                        'settings.duration', 'settings.galleryPhotoUrl'
                    ]}
                    query={userID}
                />                

                <div className={styles.searchAndResultsContainer}>
                           
                    <ItinGalCompWrapper>                                                
                            <div>   
                                <CustomHits searchClient={searchClient} searchQuery={userID}/>                        
                            </div>                                  
                    </ItinGalCompWrapper>                
                </div>
            </InstantSearch>
        </div>
    );
};

export default UserItinerariesList;
