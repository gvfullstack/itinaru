import {updateItineraryAccessUser} from './updateJoinAccessTableUser';
import { AuthenticatedUser } from '@/components/typeDefs';
import {UpdateUserAccessProps} from '../UserProfileTypeDefs';

export const updateItineraryAccessUserData = async (
    email: string,
    username: string,
    profilePictureUrl: string,
    authUser: AuthenticatedUser
  ): Promise<void> => {
        const updatedFields: Partial<UpdateUserAccessProps> = {};
        const uid = authUser.uid || '';
        
        updatedFields.uid = uid;

        const checkAndUpdateField = (field: keyof UpdateUserAccessProps, newValue: any) => {
            const oldValue = authUser?.[field] || '';
            if (newValue !== oldValue) {
                updatedFields[field] = newValue;
            }
        };
    
        checkAndUpdateField('email', email);
        checkAndUpdateField('username', username || '');
        checkAndUpdateField('profilePictureUrl', profilePictureUrl || '');
        console.log('profilePictureUrl', profilePictureUrl )
    
        if (Object.keys(updatedFields).length > 1) {  // More than just `userId`
            updateItineraryAccessUser(updatedFields as UpdateUserAccessProps);                
        }

    }
    