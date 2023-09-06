import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, PoweredBy, useHits, useRefinementList, Configure  } from 'react-instantsearch';
import ItinGalCompWrapper from '../itinGallery/itinGalCompWrapper';
import ItinGalleryComponent from '../itinGallery/itinGalleryComponent';
import styles from './searchBar.module.css';
import { useState } from 'react';

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


    function CustomHits(props:any) {

        const { hits} = useHits();
        console.log(hits)
        return <> {hits.map((itin, index) => (
            <ItinGalleryComponent 
                key={index}
                title={itin.title as string}
                description={itin.description as string}
                neighborhood={itin.neighborhood as string}
                city={itin.city as string}
                state={itin.state as string}
                duration={itin.duration as string}
                imageUrl={itin.imageUrl as string}
                visibility={itin.visibility as string}
                sharedWith={itin.sharedWith as Array<string>}
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
                        "title", 
                        "description", 
                        "neighborhood", 
                        "city", 
                        "state", 
                        "duration", 
                        "imageUrl", 
                        "visibility", 
                        "sharedWith"
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


