import { TripPreferences } from "../../aiItinTypeDefs";

  const convertDateToString = (date?: Date): string => {
    if (!date) {
      return '';
    }

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert to 24-hour format
    const hours24 = hours.toString().padStart(2, '0');
    const timeString = `${hours24}:${minutes.toString().padStart(2, '0')}`;

    return timeString;
  };
    

  export const getSelectedTripPreferences = (preferences: TripPreferences) => {

    const specificSitesToInclude = preferences.specificSitesToInclude ?? [];
    const specificSitesToExclude = preferences.specificSitesToExclude ?? [];
    const experienceSoughtThisTrip = preferences.experienceSoughtThisTrip ?? '';
    const typeOfEateriesToIncludeInItinerary = preferences.typeOfEateriesToIncludeInItinerary ?? [];
    
    const formattedPreferences:  any = {};

    const selectedTypeOfEateries = typeOfEateriesToIncludeInItinerary
    .filter(e => e.selected)
    .map(e => e.label);
    if (selectedTypeOfEateries.length > 0) {
      formattedPreferences.typeOfEateriesToIncludeInItinerary = selectedTypeOfEateries;
    }
  
    
    if (specificSitesToInclude.length > 0) {
      formattedPreferences.specificSitesToInclude = specificSitesToInclude;
    }

    if (specificSitesToExclude.length > 0) {
      formattedPreferences.specificSitesToExclude = specificSitesToExclude;
    }
    if (experienceSoughtThisTrip.length > 0) {
      formattedPreferences.experienceSoughtThisTrip = experienceSoughtThisTrip;
    }
  
    const tripPreferencesString = JSON.stringify(formattedPreferences, null, 2);
    if (tripPreferencesString.length === 0) {
      return '';
    }

    return tripPreferencesString;
  };

  export const getSelectedTripPreferencesNeighborhoods = (preferences: TripPreferences) => {

    const specificSitesToInclude = preferences.specificSitesToInclude ?? [];
    const experienceSoughtThisTrip = preferences.experienceSoughtThisTrip ?? '';
    const formattedPreferences: {specificSitesToInclude?: any[]; experienceSoughtThisTrip?: string } = {
    
     };
    
    if (specificSitesToInclude.length > 0) {
      formattedPreferences.specificSitesToInclude = specificSitesToInclude;
    }
  
    if (experienceSoughtThisTrip.length > 0) {
      formattedPreferences.experienceSoughtThisTrip = experienceSoughtThisTrip;
    }
  
    const tripPreferencesString = JSON.stringify(formattedPreferences, null, 2);
    
    if (tripPreferencesString.length === 0) {
      return '';
    }

    return tripPreferencesString;
  };