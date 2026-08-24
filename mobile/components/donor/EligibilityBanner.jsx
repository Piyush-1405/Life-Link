import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EligibilityBanner = ({ isEligible, nextEligibleDate, isAvailable }) => {
  if (!isAvailable) {
    return (
      <View style={[styles.banner, styles.bannerRed]}>
        <Ionicons name="close-circle" size={24} color="#EF4444" />
        <View style={styles.content}>
          <Text style={styles.title}>Currently Unavailable</Text>
          <Text style={styles.subtitle}>You are marked as unavailable for donations.</Text>
        </View>
      </View>
    );
  }

  if (isEligible) {
    return (
      <View style={[styles.banner, styles.bannerGreen]}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        <View style={styles.content}>
          <Text style={styles.title}>You are eligible to donate!</Text>
          <Text style={styles.subtitle}>Thank you for being available to save lives.</Text>
        </View>
      </View>
    );
  }

  // Calculate days until eligible
  const days = nextEligibleDate 
    ? Math.ceil((new Date(nextEligibleDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <View style={[styles.banner, styles.bannerYellow]}>
      <Ionicons name="time" size={24} color="#F59E0B" />
      <View style={styles.content}>
        <Text style={styles.title}>Not eligible yet</Text>
        <Text style={styles.subtitle}>You can donate again in {days} days.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerGreen: {
    backgroundColor: '#10B98120',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  bannerYellow: {
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  bannerRed: {
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 4,
  },
});

export default EligibilityBanner;
