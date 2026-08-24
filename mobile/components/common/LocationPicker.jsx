import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from '../../hooks/useLocation';
import Button from './Button';

const LocationPicker = ({ location, setLocation }) => {
  const { getCurrentLocation, loading, error } = useLocation();

  const handleGetLocation = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setLocation(loc);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      
      <View style={styles.locationDisplay}>
        {location ? (
          <Text style={styles.locationText}>
            Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>No location selected</Text>
        )}
      </View>
      
      <Button 
        title="Use Current Location" 
        onPress={handleGetLocation} 
        loading={loading}
        variant="secondary"
        icon="location"
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  locationDisplay: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  locationText: {
    color: '#fff',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default LocationPicker;
