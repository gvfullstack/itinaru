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


const useResetAuthUserState = () => useResetRecoilState(authUserState);
const useResetPrivacySettingsState = () => useResetRecoilState(privacySettingsState);
const useResetItineraryItemsState = () => useResetRecoilState(itineraryItemsState);
const useResetCurStepState = () => useResetRecoilState(curStepState);
const useResetDefaultAtom = () => useResetRecoilState(defaultAtom);
const useResetAffiliatesAtom = () => useResetRecoilState(affiliatesAtom);
const useResetUserPreferencesAtom = () => useResetRecoilState(userPreferencesAtom);
const useResetTripPreferencesAtom = () => useResetRecoilState(tripPreferencesAtom);
const useResetNeighborhoodRecommendationList = () => useResetRecoilState(neighborhoodRecommendationList);
const useResetPagePropsAtom = () => useResetRecoilState(pagePropsAtom);
const useResetCurrentlyEditingItineraryState = () => useResetRecoilState(currentlyEditingItineraryState);
const useResetShowItineraryEditForm = () => useResetRecoilState(showItineraryEditForm);
const useResetSaveStatusDisplayedEditFormContainer = () => useResetRecoilState(saveStatusDisplayedEditFormContainer);
const useResetSearchUserResultsState = () => useResetRecoilState(searchUserResultsState);
const useResetSearchUserQueryState = () => useResetRecoilState(searchUserQueryState);
const useResetItineraryAccess = () => useResetRecoilState(itineraryAccess);
const useResetItineraryAccessItinView = () => useResetRecoilState(itineraryAccessItinView);
const useResetItineraryInEditNeedsDeletionFromRecoilState = () => useResetRecoilState(itineraryInEditNeedsDeletionFromRecoilState);
const useResetMyItinerariesResults = () => useResetRecoilState(myItinerariesResults);
const useResetCurrentlyViewingItineraryState = () => useResetRecoilState(currentlyViewingItineraryState);
const useResetSearchResultsState = () => useResetRecoilState(searchResultsState);
const useResetSearchQueryState = () => useResetRecoilState(searchQueryState);


const useResetAllStates = () => {
  const resetAuthUserState = useResetAuthUserState();
  const resetPrivacySettingsState = useResetPrivacySettingsState();
  const resetItineraryItemsState = useResetItineraryItemsState();
  const resetCurStepState = useResetCurStepState();
  const resetDefaultAtom = useResetDefaultAtom();
  const resetAffiliatesAtom = useResetAffiliatesAtom();
  const resetUserPreferencesAtom = useResetUserPreferencesAtom();
  const resetTripPreferencesAtom = useResetTripPreferencesAtom();
  const resetNeighborhoodRecommendationList = useResetNeighborhoodRecommendationList();
  const resetPagePropsAtom = useResetPagePropsAtom();
  const resetCurrentlyEditingItineraryState = useResetCurrentlyEditingItineraryState();
  const resetShowItineraryEditForm = useResetShowItineraryEditForm();
  const resetSaveStatusDisplayedEditFormContainer = useResetSaveStatusDisplayedEditFormContainer();
  const resetSearchUserResultsState = useResetSearchUserResultsState();
  const resetSearchUserQueryState = useResetSearchUserQueryState();
  const resetItineraryAccess = useResetItineraryAccess();
  const resetItineraryAccessItinView = useResetItineraryAccessItinView();
  const resetItineraryInEditNeedsDeletionFromRecoilState = useResetItineraryInEditNeedsDeletionFromRecoilState();
  const resetMyItinerariesResults = useResetMyItinerariesResults();
  const resetCurrentlyViewingItineraryState = useResetCurrentlyViewingItineraryState();
  const resetSearchResultsState = useResetSearchResultsState();
  const resetSearchQueryState = useResetSearchQueryState();
  
  return () => {
    resetAuthUserState();
    resetPrivacySettingsState();
    resetItineraryItemsState();
    resetCurStepState();
    resetDefaultAtom();
    resetAffiliatesAtom();
    resetUserPreferencesAtom();
    resetTripPreferencesAtom();
    resetNeighborhoodRecommendationList();
    resetPagePropsAtom();
    resetCurrentlyEditingItineraryState();
    resetShowItineraryEditForm();
    resetSaveStatusDisplayedEditFormContainer();
    resetSearchUserResultsState();
    resetSearchUserQueryState();
    resetItineraryAccess();
    resetItineraryAccessItinView();
    resetItineraryInEditNeedsDeletionFromRecoilState();
    resetMyItinerariesResults();
    resetCurrentlyViewingItineraryState();
    resetSearchResultsState();
    resetSearchQueryState();    
  }

};

export default useResetAllStates;
