import React, {useEffect} from 'react';
import { useRecoilValue } from 'recoil';
import { authUserState } from '../../atoms/atoms';
import UsernameUpdate from '../../components/Profile/UsernameUpdate'; // Adjust the import path as necessary
import { useRouter } from 'next/router';

const SelectUserName = () => {
    const authUser = useRecoilValue(authUserState);
    const router = useRouter();
  
    useEffect(() => {
      // Redirect to the home page if the username is already set
      if (authUser?.username !== "") {
        console.log(`authUser?.username !== "" eval to trueusername already set to ${authUser?.username}`);
        router.push('/'); // Redirect to the home page or another appropriate route
      }
    }, [authUser, router]);
  
    // Render UsernameUpdate only if the username is not set
    if (authUser?.username === "") {
      return <UsernameUpdate />;
    }
  
    // If the username is already set or authUser is not available, render nothing
    return null // You could also place a loader or a fallback UI here
  
};

export default SelectUserName;
