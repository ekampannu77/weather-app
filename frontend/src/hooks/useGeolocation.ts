import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  coords: { lat: number; lon: number } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    coords: null,
  });

  const getLocation = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by your browser';
        setState((s) => ({ ...s, error: err }));
        reject(new Error(err));
        return;
      }

      setState({ loading: true, error: null, coords: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordStr = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
          setState({ loading: false, error: null, coords: { lat: latitude, lon: longitude } });
          resolve(coordStr);
        },
        (err) => {
          const message =
            err.code === 1
              ? 'Location access denied. Please enable location permissions.'
              : 'Unable to determine your location. Please try again.';
          setState({ loading: false, error: message, coords: null });
          reject(new Error(message));
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { ...state, getLocation };
}
