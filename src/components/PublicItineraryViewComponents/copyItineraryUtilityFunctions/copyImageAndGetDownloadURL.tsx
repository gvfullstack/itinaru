import { ref as storageRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from '../../FirebaseAuthComponents/config/firebase.storage';

export async function copyImageAndGetDownloadURL(originalUrl:string, newItineraryId:string, userId:string | undefined) {
    // Step 1: Get a reference to the original image
    const originalRef = storageRef(firebaseStorage, originalUrl);

    // Step 2: Download the image and then upload it to the new location
    const newImagePath = `itineraries/${userId}/${newItineraryId}/itineraryGalleryPhoto` ?? "";

    if (!firebaseStorage) {
        console.error('firebaseStorage is undefined');
        return null;
    }
    const newImageRef = storageRef(firebaseStorage, newImagePath);

    try {
        // Download the original image
        const blob = await fetch(await getDownloadURL(originalRef)).then(r => r.blob());

        // Upload to the new location
        const uploadTask = uploadBytesResumable(newImageRef, blob);
        
        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
                () => {},
                (error) => reject(error),
                () => resolve(uploadTask.snapshot.ref)
            );
        });

        // Get the download URL of the new image
        const newDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        return newDownloadURL;
    } catch (error) {
        console.error("Error in copying image:", error);
        throw error;
    }
}