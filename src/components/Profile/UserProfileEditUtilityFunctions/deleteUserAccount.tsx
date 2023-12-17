import { markUserAsDeleted } from './markUserAsDeleted'
import { bulkMarkUserAccessAsDeleted } from './bulkMarkUserAccessAsDeleted ';
import { bulkMarkUserItinerariesAsDeleted } from './bulkMarkUserItinerariesAsDeleted ';
import { toast } from 'react-toastify';

export const deleteUserAccount = async (userId: string): Promise<void> => {
  if (!userId) {
    toast.warn("User ID is required.");
    throw new Error("User ID is required.");
  }

  try {

    // Delete all user access records
    await bulkMarkUserAccessAsDeleted(userId);
    toast.success("All user access records marked as deleted.");

    // Delete all user itineraries
    await bulkMarkUserItinerariesAsDeleted(userId);
    toast.success("All itineraries and items marked as deleted.");

    // Mark the user as deleted
    await markUserAsDeleted(userId);
    toast.success("User marked as deleted.");

    toast.success("User account successfully deleted.");
  } catch (error) {
    console.error("Error in deleting user account:", error);
    toast.error("An error occurred during the account deletion process.");
  }
};
