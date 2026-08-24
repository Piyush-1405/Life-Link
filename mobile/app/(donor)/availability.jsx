import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as donorService from '../../services/donor.service';
import Card from '../../components/common/Card';
import LocationPicker from '../../components/common/LocationPicker';
import Button from '../../components/common/Button';

export default function AvailabilityScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await donorService.getProfile();
        setIsAvailable(res.profile.isAvailable);
        if (res.profile.location?.coordinates) {
          setLocation({
            longitude: res.profile.location.coordinates[0],
            latitude: res.profile.location.coordinates[1]
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoad(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await donorService.toggleAvailability(isAvailable);
      
      if (location) {
        await donorService.updateProfile({
          location: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          }
        });
      }
      
      Alert.alert('Success', 'Availability updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return null;

  return (
    <ScrollView style={styles.container}>
      <Card title="Donation Availability" style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Available to Donate</Text>
            <Text style={styles.description}>
              Turn this on to receive notifications when someone needs blood.
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#374151', true: '#10B981' }}
            thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
            onValueChange={setIsAvailable}
            value={isAvailable}
          />
        </View>
      </Card>

      <Card title="Current Location" style={styles.section}>
        <Text style={styles.locationDesc}>
          Update your location to get matched with requests nearby.
        </Text>
        <LocationPicker location={location} setLocation={setLocation} />
      </Card>

      <Button 
        title="Save Changes" 
        onPress={handleSave} 
        loading={loading}
        size="lg"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  locationDesc: {
    color: '#9CA3AF',
    marginBottom: 16,
    fontSize: 14,
  }
});
