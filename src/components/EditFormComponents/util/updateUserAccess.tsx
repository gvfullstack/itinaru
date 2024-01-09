import { useEffect, useRef, useState } from 'react';
import {UpdateItineraryAccessProps, Itinerary} from '../editFormTypeDefs';
import {updateItineraryAccess} from '../EditFormShareFunctionality/utils/updateJoinAccessTableItineraries';

export const useUpdateItineraryAccess = ({itinerary}: {itinerary: Itinerary}) => {
    const [lastSavedItinerary, setLastSavedItinerary] = useState<UpdateItineraryAccessProps>({
        itineraryId: '',
        title: '',
        neighborhood: '',
        city: '',
        state: '',
        galleryPhotoUrl: '',
        visibility: 'private' // replace with your default
    });
    
    useEffect(() => {
        setLastSavedItinerary({
            itineraryId: itinerary.id || '',
            title: itinerary.settings?.title || '',
            neighborhood: itinerary.settings?.neighborhood || '',
            city: itinerary.settings?.city || '',
            state: itinerary.settings?.state || '',
            galleryPhotoUrl: itinerary.settings?.galleryPhotoUrl || '',
            visibility: itinerary.settings?.visibility || 'private', // replace with your default
        });
    }, []);

    useEffect(() => {
        const updatedFields: Partial<UpdateItineraryAccessProps> = {};
        const id = itinerary.id || '';
        const visibility = itinerary.settings?.visibility || 'private'; // Replace with your default
        let timerId: NodeJS.Timeout;

        updatedFields.itineraryId = id;
        updatedFields.visibility = visibility;
    
        const checkAndUpdateField = (field: keyof UpdateItineraryAccessProps, newValue: any) => {
            const oldValue = lastSavedItinerary?.[field] || '';
            if (newValue !== oldValue) {
                updatedFields[field] = newValue;
            }
        };
    
        checkAndUpdateField('itineraryId', id);
        checkAndUpdateField('title', itinerary.settings?.title || '');
        checkAndUpdateField('neighborhood', itinerary.settings?.neighborhood || '');
        checkAndUpdateField('city', itinerary.settings?.city || '');
        checkAndUpdateField('state', itinerary.settings?.state || '');
        checkAndUpdateField('galleryPhotoUrl', itinerary.settings?.galleryPhotoUrl || '');
        checkAndUpdateField('visibility', visibility);
    
        if (Object.keys(updatedFields).length > 2) {  // More than just `itineraryId` and `visibility`
            timerId = setTimeout(() => {
                updateItineraryAccess(updatedFields as UpdateItineraryAccessProps);
                setLastSavedItinerary(prev => ({
                    ...prev,
                    ...updatedFields
                }));
            }, 5000); // 5 seconds delay
        }
    
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };


    }, [
        itinerary.id,
        itinerary.settings?.title,
        itinerary.settings?.neighborhood,
        itinerary.settings?.city,
        itinerary.settings?.state,
        itinerary.settings?.galleryPhotoUrl,
        itinerary.settings?.visibility,
    ]);
    
}
