import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import SearchInput from './searchPageComponents/searchInput';
import SearchButton from './searchPageComponents/searchButton';
import styles from './searchBar.module.css';
import { useState, useRef, useEffect } from 'react';
import ItinGalCompWrapper from '../ItinGallery/itinGalCompWrapper';
import CustomHits from './searchPageComponents/customHits';
import algoliasearch from 'algoliasearch';
import { useRecoilState } from 'recoil';
import {searchResultsState, searchQueryState} from './searchAtoms';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
const searchClient = algoliasearch(appId, searchKey);

const SearchBar: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
    const divRef = useRef<HTMLDivElement>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearchReady, setIsSearchReady] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSearchSubmit = (event?: React.MouseEvent<HTMLDivElement> | React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        if(inputValue==searchQuery) {return}
        setIsSearchReady(false); // Prevent Configure from rendering with outdated searchQuery
        setSearchQuery(inputValue); // Update the searchQuery
    
        if (divRef.current) {
            divRef.current.blur(); // Remove focus from the input/button
        }
    };

    useEffect(() => {
        if (searchQuery) {
            setIsSearchReady(true); // Allow Configure to render with updated searchQuery
        }
    }, [searchQuery]); // Dependency on searchQuery

    return (
        <div className={styles.container}>
            <InstantSearch searchClient={searchClient} indexName="itineraries">
            {isSearchReady && (
                <Configure 
                    attributesToRetrieve={[
                        'id', 'uid', 'profilePictureUrl', 'settings.title', 'settings.description',
                        'settings.neighborhood', 'settings.city', 'settings.state',
                        'settings.duration', 'settings.galleryPhotoUrl'
                    ]}
                    query={searchQuery}
                />                
                )}
                <div className={styles.searchAndResultsContainer}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <SearchInput inputValue={inputValue} onChange={handleInputChange} />
                        <SearchButton 
                            onClick={handleSearchSubmit} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit();
                                }
                            }} 
                        />
                    </form>
                    {searchLoading && (
                        <div className={styles.loadingBar}>
                            <div className={styles.loadingBarProgress}></div>
                        </div>
                    )}                      
            <ItinGalCompWrapper>                            
                        {/* {searchQuery &&  */}
                            <div>   
                                <CustomHits searchClient={searchClient}/>                        
                            </div>
                         {/* } */}
                       
                        </ItinGalCompWrapper>                
                </div>
            </InstantSearch>
        </div>
    );
};

export default SearchBar;
