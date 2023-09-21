import { Loader } from "@googlemaps/js-api-loader";
import React, { useState, useEffect, createContext, useContext, } from 'react';

type GoogleMapsProviderProps = {
  children: React.ReactNode;
}

export const GoogleMapsContext = createContext<boolean | null>(null);

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY as string,
      version: "weekly",
    });

    loader.importLibrary('places').then(() => {
      setIsLoaded(true); // Set the state to true when the library is loaded
    }).catch(err => {
      console.error("Error loading Google Maps API:", err);
    });
  }, []);

  return (
     <GoogleMapsContext.Provider value={isLoaded}>
       {children}
     </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsProvider;