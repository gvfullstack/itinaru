// useGoogleMapsLoader.ts
import { useEffect, useState } from 'react';

const useGoogleMapsLoader = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else if (window.google) {
      setLoaded(true);
    }
  }, [apiKey]);

  return loaded;
};

export default useGoogleMapsLoader;
