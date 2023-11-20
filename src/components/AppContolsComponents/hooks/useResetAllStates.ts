import { useResetRecoilState } from 'recoil';

// Importing atoms from different modules
import { authUserState, privacySettingsState } from '../../../atoms/atoms'

//AI assisted itinerary atoms
import {
    itineraryItemsState, 
    curStepState, 
    defaultAtom, 
    affiliatesAtom, 
    userPreferencesAtom, 
    tripPreferencesAtom, 
    neighborhoodRecommendationList, 
    pagePropsAtom} from '../../AIAssistedItinerary/aiItinAtoms';

//editFormAtoms
import {
    currentlyEditingItineraryState, 
    showItineraryEditForm, 
    saveStatusDisplayedEditFormContainer, 
    searchUserResultsState, 
    searchUserQueryState, 
    itineraryAccess, 
    itineraryAccessItinView, 
    itineraryInEditNeedsDeletionFromRecoilState} from '../../EditFormComponents/editFormAtoms';

//my itineraries atoms
import {myItinerariesResults} from '../../MyItinerariesGallery/myItinerariesAtoms';

//publicViewItinerary atoms
import {currentlyViewingItineraryState} from '../../PublicItineraryViewComponents/publicItinViewAtoms'; 

//search bar results atoms
import {searchResultsState, searchQueryState} from '../../SearchBar/searchAtoms';

const useResetAllStates = () => {
    const atomsToReset = [
        authUserState, privacySettingsState, 
        itineraryItemsState, curStepState, 
        defaultAtom, affiliatesAtom, 
        userPreferencesAtom, tripPreferencesAtom, 
        neighborhoodRecommendationList, pagePropsAtom,
        currentlyEditingItineraryState, showItineraryEditForm, 
        saveStatusDisplayedEditFormContainer, searchUserResultsState, 
        searchUserQueryState, itineraryAccess, 
        itineraryAccessItinView, itineraryInEditNeedsDeletionFromRecoilState,
        myItinerariesResults, currentlyViewingItineraryState,
        searchResultsState, searchQueryState  
    ];

   // Create a reset function for each atom
    const resets = atomsToReset.map(atom => useResetRecoilState(atom));
  
  // Return a function that when called, will reset all states
  return () => {
    resets.forEach(reset => reset());
  };
};

export default useResetAllStates;
