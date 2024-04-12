import { useHits } from 'react-instantsearch-hooks-web';
import { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {searchResultsState, searchQueryState} from '../searchAtoms';
import algoliasearch from 'algoliasearch';
import ItinGalleryComponent from '../../ItinGallery/itinGalleryComponent';

import {AlgoliaHitType } from '../searchTypeDefs';

interface CustomHitsProps {
    searchClient: ReturnType<typeof algoliasearch>;
}

export default function CustomHits({ searchClient }: CustomHitsProps) {
    const { hits } = useHits<any>();
    const [savedHits, setSearchResults] = useRecoilState(searchResultsState);
    const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
    console.log(searchQuery, 'searchQuery at customHits.tsx useEffect')

      
    useEffect(() => {
        console.log('hits:', hits);
    
        // Step 1: Classify records
        const directItineraries = hits.filter(hit => !hit._highlightResult.itineraryParentId);
        let itemParentIds = hits
            .filter(hit => hit._highlightResult.itineraryParentId)
            .map(hit => hit._highlightResult.itineraryParentId.value);
    
        // Remove duplicates of parent IDs of returned items
        itemParentIds = Array.from(new Set(itemParentIds));      
    
        const processHits = async () => {
            let fetchedItineraries:AlgoliaHitType[] = [];
    
            // Step 2: Fetch parent itineraries
            if (itemParentIds.length > 0) {
                const fetchItineraryPromises = itemParentIds.map(id =>
                    searchClient.initIndex('itineraries').getObject(id)
                        .catch(error => {
                            console.error('Error fetching itinerary with ID:', id, error);
                            return null; // Return null or an appropriate fallback value
                        })
                );
            
                try {
                    const fetchItineraryPromises = itemParentIds.map(id =>
                        searchClient.initIndex('itineraries').getObject(id)
                            .catch(error => {
                                console.error('Error fetching itinerary with ID:', id, error);
                                return null;
                            })
                    );
                
                    let results = await Promise.all(fetchItineraryPromises);
                    
                    // Filter out null values and assert the type to AlgoliaHitType
                    fetchedItineraries = results.filter((item): item is AlgoliaHitType => item !== null);
                
                } catch (error) {
                    console.error('Error in fetching itineraries:', error);
                }
                
            }       
    
            // Step 3: Combine direct and fetched itineraries
            let combinedItineraries = [...directItineraries, ...fetchedItineraries];
    
            // Step 4: Ensure uniqueness
            combinedItineraries = Array.from(new Map(combinedItineraries.map(itin => [itin.objectID, itin])).values());
            // Update the existing itineraries in the global state
            setSearchResults(combinedItineraries);
        };
    
        processHits();
    }, [hits]); // Assuming hits is a dependency for this effect
    

    return (
        <>{savedHits.map((itin, index) => (
            <ItinGalleryComponent 
                key={index}
                itinId={itin.objectID || ''}
                userId={itin.uid || ''}
                profilePictureUrl={itin.profilePictureUrl || ''}
                title={itin.settings?.title || ''}
                description={itin.settings?.description || ''}
                neighborhood={itin.settings?.neighborhood || ''}
                city={itin.settings?.city || ''}
                state={itin.settings?.state || ''}
                duration={itin.settings?.duration || 0}
                imageUrl={itin.settings?.galleryPhotoUrl || ''}
            />
        ))}</>
    );
}