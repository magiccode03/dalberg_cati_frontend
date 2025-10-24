import { useEffect, useState } from 'react';

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
}

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  loadError: string | null;
  google: typeof window.google | null;
}

// Global state to track Google Maps loading
let isGoogleMapsLoading = false;
let googleMapsLoadPromise: Promise<void> | null = null;

export const useGoogleMaps = ({ apiKey, libraries = [] }: UseGoogleMapsOptions): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // If Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // If already loading, wait for the existing promise
    if (isGoogleMapsLoading && googleMapsLoadPromise) {
      googleMapsLoadPromise
        .then(() => setIsLoaded(true))
        .catch((error) => setLoadError(error.message));
      return;
    }

    // Start loading Google Maps
    isGoogleMapsLoading = true;
    
    googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkLoaded = () => {
          if (window.google && window.google.maps) {
            isGoogleMapsLoading = false;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Create and load new script
      const script = document.createElement('script');
      const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isGoogleMapsLoading = false;
        resolve();
      };

      script.onerror = () => {
        isGoogleMapsLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    googleMapsLoadPromise
      .then(() => setIsLoaded(true))
      .catch((error) => setLoadError(error.message));
  }, [apiKey, libraries]);

  return {
    isLoaded,
    loadError,
    google: isLoaded ? window.google : null,
  };
};

