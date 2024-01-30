import {atom} from 'recoil';

interface TokenState {
    token: string | null;
    expirationTime: number | null; // Expiration time in milliseconds
  }
  
  // Create a recoil atom to hold the token and its expiration time
  export const tokenState = atom<TokenState>({
    key: 'tokenState', // Unique ID for this atom
    default: {
      token:  null,
      expirationTime: null,
    },
  });