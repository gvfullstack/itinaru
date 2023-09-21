import { UserPreferences } from "../../aiItinTypeDefs";

export const getSelectedUserPreferences = (preferences: UserPreferences) => {
  const selectedPreferences: any = {};

  if (preferences.favoritePlacesPreviouslyVisited && preferences.favoritePlacesPreviouslyVisited?.length > 0) {
    selectedPreferences.favoritePlacesPreviouslyVisited = preferences.favoritePlacesPreviouslyVisited;
  }

  const selectedExperienceTypes = preferences.favoriteExperienceTypes?.filter(e => e.selected)?.map(e => e.label) ?? [];
  if (selectedExperienceTypes.length > 0) {
    selectedPreferences.favoriteExperienceTypes = selectedExperienceTypes;
  }

  if (preferences.favoriteRestaurantsPreviouslyVisited && preferences.favoriteRestaurantsPreviouslyVisited.length > 0) {
    selectedPreferences.favoriteRestaurantsPreviouslyVisited = preferences.favoriteRestaurantsPreviouslyVisited;
  }

  const selectedFavoriteCuisine = preferences.favoriteCuisine?.filter(e => e.selected)?.map(e => e.label) ?? [];

  if (selectedFavoriteCuisine.length > 0) {
    selectedPreferences.favoriteCuisine = selectedFavoriteCuisine;
  }

  const selectedDiningExperience = preferences.diningExperience?.filter(e => e.selected)?.map(e => e.label) ?? [];
  if (selectedDiningExperience.length > 0) {
    selectedPreferences.diningExperience = selectedDiningExperience;
  }

  // selectedPreferences.dailyBudget = preferences.dailyBudget?.Amount + " " + preferences.dailyBudget?.Currency;

  const selectedPreferencesString = JSON.stringify(selectedPreferences, null, 2);

  return selectedPreferencesString;
};
