import React, { useState, useEffect, use } from 'react';
import { useRecoilState } from 'recoil';
import styles from './TokenComponent.module.css';
import handleSaveTokenToFirebase from './utils/handleSaveTokenToFirebase';
import generateToken from './utils/generateToken';
import {authUserState} from '@/atoms/atoms';
import {tokenState} from './GPTUserTokenAtoms';
import calculateDaysRemaining from './utils/calculateDaysRemaining';
import fetchTokenData from './utils/fetchTokenDataFromFirebase';
import {DynamicFontAwesomeIcon} from '@/components';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const TokenComponent = () => {
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [token, setToken] = useRecoilState(tokenState);
    const copyIcon = <DynamicFontAwesomeIcon icon={faCopy} onClick={() => copyToClipboard(token.token)} />
    const [copiedDisplay, setCopiedDisplay] = useState(false);
    const [copiedDisplayError, setCopiedDisplayError] = useState(false);

    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        const getTokenData = async () => {
            if (authUser?.uid) {
                const tokenData = await fetchTokenData(authUser.uid);
                console.log("token data is: ", tokenData);
                setToken(tokenData);
                setLoading(false); // Set loading to false after fetching data
            } else {
                setLoading(false); // Set loading to false if authUser is not available
            }
        };
    
        setLoading(true); // Set loading to true when the component mounts or authUser changes
        getTokenData();
    }, [authUser]); 
    

    const handleGenerateToken = () => {
        const generatedTokenInfo = generateToken(); // this will have token and expirationTime
        setToken(generatedTokenInfo); // set the entire object, not just the token string
    
        if (!authUser?.uid) {
            return;
        } else {
            handleSaveTokenToFirebase({
                userID: authUser.uid, // assuming authUser?.uid is the userID
                token: generatedTokenInfo.token,
                expirationTime: generatedTokenInfo.expirationTime,
            });
        }
    }

    const copyToClipboard = (text: string | null) => {
        if (!text) {
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            setCopiedDisplay(true); // Show success message
            setTimeout(() => {
                setCopiedDisplay(false); // Hide success message after 1 second
            }, 600);
        }, () => {
            setCopiedDisplayError(true); // Show error message
            setTimeout(() => {
                setCopiedDisplayError(false); // Hide error message after 1 second
            }, 600);
        });
    };

    if (loading) {
        return <div className={styles.container}></div>; // Display a loading message or spinner
    }

    const daysRemaining = calculateDaysRemaining(token.expirationTime);
      
    return (
        <div className={styles.container}>
            {token.token ?
    
            <p className={styles.message}>
                This is your Private User Token for managing itineraries using our GPT. Please do not share with anyone.
                If you ever suspect that your token has been compromised, please generate a new one.
                This token will expire in {daysRemaining} days and a new one will be assigned.
            </p>:
            <p className={styles.message}>
            Press to get a new token
        </p>}
            {token.token && 
            <div className={styles.tokenSection}>
                <h3>{token.token}</h3>
                <p>{copyIcon}</p>
                {copiedDisplay && <p>copied!</p>}
                {copiedDisplayError && <p>Failed to copy token!</p>}
            </div>
            
            }
            <button className={styles.button} onClick={handleGenerateToken}>Generate New Token</button>
            {token.expirationTime && <div className={styles.countdown}>Token will expire in {daysRemaining} days</div>}
        </div>
    );
};

export default TokenComponent;
