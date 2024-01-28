import React, { useState, useEffect, useRef } from 'react';
import { getFirebaseAuth} from "../components/FirebaseAuthComponents/config/firebase.auth";
import { useRecoilState } from 'recoil';
import { authUserState } from '../atoms/atoms'
import { useRouter } from 'next/router';
import TokenComponent from '@/components/GPTUserToken/TokenComponentContainer';
import SkeletonComponent from '@/components/GPTUserToken/utils/gptUserTokenSkeleton'; 

const GPTUserToken: React.FC = () => {
    const router = useRouter();
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [loading, setLoading] = useState(true); // State to handle the visibility of the skeleton


    useEffect(() => {
        // Hide skeleton after 1 second
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        if (authUser) {
            clearTimeout(timer); // Clear the timer if authUser exists
            setLoading(false); // Immediately hide skeleton if user is authenticated
        } else {
            sessionStorage.setItem('preLoginRoute', router.asPath);
            const timeoutId = setTimeout(() => {
                router.push('/loginPage');
            }, 1500);
            return () => clearTimeout(timeoutId); // Cleanup the navigation timeout
        }

        return () => clearTimeout(timer); // Cleanup the skeleton timeout
    }, [authUser, router]);

    if (loading) {
        return <SkeletonComponent />; // Render the skeleton component while loading
    }

    return (
        <>
            <TokenComponent />
        </>
    );
};

export default GPTUserToken;
