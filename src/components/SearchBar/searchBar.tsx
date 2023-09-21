import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, PoweredBy, useHits, useRefinementList, Configure  } from 'react-instantsearch';
import ItinGalCompWrapper from '../ItinGallery/itinGalCompWrapper';
import ItinGalleryComponent from '../ItinGallery/itinGalleryComponent';
import styles from './searchBar.module.css';
import { useState } from 'react';
import { Itinerary } from './searchTypeDefs';

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
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSearchQuery(inputValue);
    };

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
        console.log(hits)
        return <> {hits.map((itin, index) => (
            <ItinGalleryComponent 
                key={index}
                itinId={itin.id as string}
                userId={itin.uid as string}
                title={itin.settings.title as string}
                description={itin.settings.description as string}
                neighborhood={itin.settings.neighborhood as string}
                city={itin.settings.city as string}
                state={itin.settings.state as string}
                duration={itin.settings.duration as string}
                imageUrl={itin.settings.galleryPhotoUrl as string}
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
                 <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Search..."
                        className={styles.searchInput}
                    />

                    <button type="submit" className={styles.submitButton}>Search</button>
                </form>
                
                <ItinGalCompWrapper>
                    {searchQuery && <CustomHits />}
                </ItinGalCompWrapper>
            </InstantSearch>
        </div>
    );
}
export default SearchBar;


