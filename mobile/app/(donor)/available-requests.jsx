import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import RequestCard from '../../components/donor/RequestCard';
import * as donorService from '../../services/donor.service';
import { Ionicons } from '@expo/vector-icons';

export default function AvailableRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await donorService.getEligibleRequests();
      setRequests(res.requests || []);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleAction = async (requestId, action) => {
    try {
      await donorService.respondToRequest(requestId, action);
      if (action === 'ACCEPTED') {
        router.push({ pathname: '/(donor)/request-detail', params: { id: requestId }});
      } else {
        fetchRequests(); // Remove from list
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to respond');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <RequestCard 
            request={item} 
            onAccept={(id) => handleAction(id, 'ACCEPTED')}
            onReject={(id) => handleAction(id, 'DECLINED')}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#374151" />
            <Text style={styles.emptyText}>No matching requests found</Text>
            <Text style={styles.emptySubtext}>We'll notify you when someone needs your blood type.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#9CA3AF',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
});
