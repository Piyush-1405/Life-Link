import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      setLoading(false);
      return false;
    }
    setLoading(false);
    return true;
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return null;
      
      let loc = await Location.getCurrentPositionAsync({});
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setLocation(coords);
      return coords;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const watchLocation = async (callback) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    return await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (loc) => {
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLocation(coords);
        if (callback) callback(coords);
      }
    );
  };

  return { location, error, loading, requestPermission, getCurrentLocation, watchLocation };
};
