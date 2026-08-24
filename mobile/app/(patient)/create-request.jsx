import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import RequestForm from '../../components/patient/RequestForm';
import * as requestService from '../../services/request.service';

export default function CreateRequestScreen() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await requestService.createRequest(data);
      Alert.alert(
        'Success', 
        'Blood request created successfully',
        [{ text: 'OK', onPress: () => {
          router.replace('/(patient)/dashboard');
          router.push({ pathname: '/(patient)/request-detail', params: { id: res.request._id }});
        }}]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <RequestForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  }
});
