import {AuthenticatedUser} from '../../../components/typeDefs/index'
import { toast } from 'react-toastify';


function checkAuthenticatedUser(authUser:AuthenticatedUser | null): boolean {
    if (!authUser || !authUser.uid) {
      console.error("No authenticated user found.");
      return false;
    }
    return true;
  }

export default checkAuthenticatedUser;