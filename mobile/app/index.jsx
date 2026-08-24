import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (user?.role === 'PATIENT') {
        router.replace('/(patient)/dashboard');
      } else if (user?.role === 'DONOR') {
        router.replace('/(donor)/dashboard');
      }
      // other roles won't use the mobile app, or would have minimal views
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>LifeLink</Text>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 24,
  },
});
