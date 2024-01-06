import { useHits } from 'react-instantsearch-hooks-web';
import { useState, useRef, useEffect } from 'react';
import {AlgoliaHitType } from '../searchTypeDefs';
import { useRecoilState } from 'recoil';
import {searchResultsState, searchQueryState} from '../searchAtoms';
import algoliasearch from 'algoliasearch';
import ItinGalleryComponent from '../../ItinGallery/itinGalleryComponent';

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
            const directItineraries = hits.filter(hit => !hit._highlightResult.itineraryParentId);
            let itemParentIds = hits
                .filter(hit => hit._highlightResult.itineraryParentId)
                .map(hit => hit._highlightResult.itineraryParentId.value);
    
            // Remove duplicates
            itemParentIds = Array.from(new Set(itemParentIds));
    
            // Filter out IDs that are already in directItineraries
            itemParentIds = itemParentIds.filter(id => !directItineraries.some(itin => itin.objectID === id));
    
            const processHits = async () => {
                let fetchedItineraries: AlgoliaHitType[] = [];
                if (itemParentIds.length > 0) {
                    try {
                        fetchedItineraries = await Promise.all(itemParentIds.map(id =>
                            searchClient.initIndex('itineraries').getObject<AlgoliaHitType>(id)
                        ));
                    } catch (error) {
                        console.error('Error fetching itineraries:', error);
                    }
                }
    
                // Update the existing itineraries in the global state with both direct and fetched itineraries
                setSearchResults(prev => [...directItineraries, ...fetchedItineraries]);
            };
    
            processHits();
    }, [hits]);
    
    useEffect(() => {
        console.log('savedHits:', hits)
        
    }, [hits])
   
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
                duration={itin.settings?.duration || ''}
                imageUrl={itin.settings?.galleryPhotoUrl || ''}
            />
        ))}</>
    );
}