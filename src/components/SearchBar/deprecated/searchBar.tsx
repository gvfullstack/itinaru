// import algoliasearch from 'algoliasearch';
// import { InstantSearch, Configure, useHits } from 'react-instantsearch-hooks-web';
// import ItinGalCompWrapper from '../ItinGallery/itinGalCompWrapper';
// import ItinGalleryComponent from '../ItinGallery/itinGalleryComponent';
// import styles from './searchBar.module.css';
// import { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import {searchResultsState, searchQueryState} from './searchAtoms';
// import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
// // import { Hit as AlgoliaHitType } from 'react-instantsearch-core';
// import {AlgoliaHitType } from './searchTypeDefs';
// import { search } from '@algolia/client-search';
// import _ from 'lodash';


// const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
// const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
// const searchClient = algoliasearch(appId, searchKey);

// const SearchBar: React.FC = () => {
//     const [inputValue, setInputValue] = useState("");
//     const divRef = useRef<HTMLDivElement>(null);
//     const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
//     const setSearchResults = useSetRecoilState(searchResultsState);
//     const savedHits = useRecoilValue(searchResultsState);
//     const searchCompletedRef = useRef(true);

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(event.target.value);
//     };

//     const handleSearchSubmit = (event?: React.FormEvent) => {
//         if (event) {
//             event.preventDefault();
//         }

//         setSearchResults([]);
//         setSearchQuery(inputValue);
//         searchCompletedRef.current = false;
        
//         if (divRef.current) {
//             divRef.current.blur();
//         }
//     };

//     function CustomHits() {
//         const { hits } = useHits<any>();
//         const hitsRef = useRef<AlgoliaHitType[]>([]);
//         const setSearchResults = useSetRecoilState(searchResultsState);
    
    
//         useEffect(() => {
//             if (!searchCompletedRef.current) {
//                 const directItineraries = hits.filter(hit => !hit._highlightResult.itineraryParentId);
//                 let itemParentIds = hits
//                     .filter(hit => hit._highlightResult.itineraryParentId)
//                     .map(hit => hit._highlightResult.itineraryParentId.value);
        
//                 // Remove duplicates
//                 itemParentIds = Array.from(new Set(itemParentIds));
        
//                 // Filter out IDs that are already in directItineraries
//                 itemParentIds = itemParentIds.filter(id => !directItineraries.some(itin => itin.objectID === id));
        
//                 const processHits = async () => {
//                     let fetchedItineraries: AlgoliaHitType[] = [];
//                     if (itemParentIds.length > 0) {
//                         try {
//                             fetchedItineraries = await Promise.all(itemParentIds.map(id =>
//                                 searchClient.initIndex('itineraries').getObject<AlgoliaHitType>(id)
//                             ));
//                         } catch (error) {
//                             console.error('Error fetching itineraries:', error);
//                         }
//                     }
        
//                     // Update the existing itineraries in the global state with both direct and fetched itineraries
//                     setSearchResults(prev => [...directItineraries, ...fetchedItineraries]);
//                     searchCompletedRef.current = true; // Mark search as complete
//                 };
        
//                 processHits();
//             }
//         }, [searchQuery, setSearchResults]);
        
        
       
//         return (
//             <>{savedHits.map((itin, index) => (
//                 <ItinGalleryComponent 
//                     key={index}
//                     itinId={itin.objectID || ''}
//                     userId={itin.uid || ''}
//                     title={itin.settings?.title || ''}
//                     description={itin.settings?.description || ''}
//                     neighborhood={itin.settings?.neighborhood || ''}
//                     city={itin.settings?.city || ''}
//                     state={itin.settings?.state || ''}
//                     duration={itin.settings?.duration || ''}
//                     imageUrl={itin.settings?.galleryPhotoUrl || ''}
//                 />
//             ))}</>
//         );
//     }
    

//     return (
//         <div className={styles.container}>
//             <InstantSearch
//                 searchClient={searchClient}
//                 indexName="itineraries"
//             >
//                 <Configure 
//                    attributesToRetrieve={[
//                         'id', 'uid', 'settings.title', 'settings.description',
//                         'settings.neighborhood', 'settings.city', 'settings.state',
//                         'settings.duration', 'settings.galleryPhotoUrl'
//                     ]}
//                     query={searchQuery}
//                 />
//                 <div className={styles.searchAndResultsContainer}>
//                     <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
//                         <input
//                             type="text"
//                             value={inputValue}
//                             onChange={handleInputChange}
//                             placeholder="Search..."
//                             className={styles.searchInput}
//                         />
//                         <div 
//                             className={styles.searchIconContainer}
//                             ref={divRef}        
//                             onClick={handleSearchSubmit}
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter') {
//                                     handleSearchSubmit();
//                                 }
//                             }}
//                             tabIndex={0}
//                         >
//                             <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
//                         </div>
//                     </form>
                    
//                     <ItinGalCompWrapper>
//                         {searchQuery && <CustomHits />}
//                     </ItinGalCompWrapper>
//                 </div>
//             </InstantSearch>
//         </div>
//     );
// }

// export default SearchBar;
