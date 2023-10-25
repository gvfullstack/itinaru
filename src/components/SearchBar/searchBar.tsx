import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, PoweredBy, useHits, useRefinementList, Configure  } from 'react-instantsearch';
import ItinGalCompWrapper from '../ItinGallery/itinGalCompWrapper';
import ItinGalleryComponent from '../ItinGallery/itinGalleryComponent';
import styles from './searchBar.module.css';
import { useState, useRef, useEffect } from 'react';
import { Itinerary } from './searchTypeDefs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {searchResultsState, searchQueryState} from './searchAtoms';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';

const appId: string = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
if (!appId) {
    throw new Error("Algolia App ID not found");
}
const searchKey: string = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
if (!searchKey) {
    throw new Error("Algolia App ID not found");
}

const searchClient = algoliasearch(appId, searchKey);


const SearchBar: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const divRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSearchSubmit = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
          }        
          
        setSearchQuery(inputValue);

        if (divRef.current) {
            divRef.current.blur();
          }

    };

    const searchIcon = (
        <FontAwesomeIcon 
            icon={faMagnifyingGlass as any} 
            className={styles.searchIcon} 
        />
    );

    type AlgoliaItinerary = {
        id: string;
        uid: string;
        settings: {
          title: string;
          description: string;
          neighborhood: string;
          city: string;
          state: string;
          duration: string;
          galleryPhotoUrl: string;
        };
      };

    function CustomHits(props:any) {
        const { hits }: { hits: AlgoliaItinerary[] } = useHits();
        const setSearchResults = useSetRecoilState(searchResultsState);
        const savedHits:AlgoliaItinerary[] = useRecoilValue(searchResultsState);

        useEffect(() => {
            setSearchResults(hits);
          }, [hits, setSearchResults]);

        return <> {savedHits.map((itin: AlgoliaItinerary, index: number) => (
            <ItinGalleryComponent 
                key={index}
                itinId={itin.id || ''}
                userId={itin.uid || ''}
                title={itin.settings?.title || ''}
                description={itin.settings?.description || ''}
                neighborhood={itin.settings?.neighborhood || ''}
                city={itin.settings?.city || ''}
                state={itin.settings?.state || ''}
                duration={itin.settings?.duration || ''}
                imageUrl={itin.settings?.galleryPhotoUrl || ''}
            />
        ))} </>;   
    }
    
      return (
        <div className={styles.container}>
            <InstantSearch
                searchClient={searchClient}
                indexName="itineraries"
            >
                <Configure 
                   attributesToRetrieve={[
                    'id',
                    "uid",
                    "settings.title",
                    "settings.description",
                    "settings.neighborhood",
                    "settings.city",
                    "settings.state",
                    "settings.duration",
                    "settings.galleryPhotoUrl"
                  ]}
                    query={searchQuery}
                />
                <div className={styles.searchAndResultsContainer}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search..."
                            className={styles.searchInput}
                        />
                        <div className={styles.searchIconContainer}     
                            ref={divRef}        
                            onClick={handleSearchSubmit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSearchSubmit();
                                }
                              }}
                            tabIndex={0}>
                            {searchIcon}
                        </div>
                        {/* <button type="submit" className={styles.submitButton}>Search</button> */}
                    </form>
                    
                    <ItinGalCompWrapper>
                        {searchQuery && <CustomHits />}
                    </ItinGalCompWrapper>
                </div>
            </InstantSearch>
        </div>
    );
}
export default SearchBar;


