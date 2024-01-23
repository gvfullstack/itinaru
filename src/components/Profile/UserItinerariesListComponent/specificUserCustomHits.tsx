import { useHits } from 'react-instantsearch-hooks-web';
import { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {specificUserSearchResultsState, specificUserSearchQueryState} from '../UserProfileAtoms';
import algoliasearch from 'algoliasearch';
import ItinGalleryComponent from '../../ItinGallery/itinGalleryComponent';

interface CustomHitsProps {
    searchClient: ReturnType<typeof algoliasearch>;
    searchQuery: string;
}

export default function CustomHits({ searchClient, searchQuery }: CustomHitsProps) {
    const { hits } = useHits<any>();
    const [savedHits, setSearchResults] = useRecoilState(specificUserSearchResultsState);
      
    useEffect(() => {    
        // Filter direct itineraries based on uid matching searchQuery
        const directItineraries = hits.filter(hit => 
            !hit._highlightResult.itineraryParentId && hit.uid === searchQuery
        );
    
        // Ensure uniqueness of the direct itineraries
        const uniqueDirectItineraries = Array.from(new Map(directItineraries.map(itin => [itin.objectID, itin])).values());
    
        // Update the existing itineraries in the global state
        setSearchResults(uniqueDirectItineraries);
    
    }, [hits, searchQuery]); // Adding searchQuery as a dependency
    
    

    useEffect(() => {
            console.log('savedHits:', savedHits)
        
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
                duration={itin.settings?.duration || 0}
                imageUrl={itin.settings?.galleryPhotoUrl || ''}
            />
        ))}</>
    );
}