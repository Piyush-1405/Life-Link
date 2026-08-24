import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import * as requestService from '../../services/request.service';
import RequestCard from '../../components/patient/RequestCard';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState({ active: 0, fulfilled: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await requestService.getMyRequests();
      const requests = res.requests || [];
      // Calculate stats
      const active = requests.filter(r => !['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(r.status)).length;
      const fulfilled = requests.filter(r => r.status === 'FULFILLED').length;
      setStats({ active, fulfilled });
      
      // Get recent 3
      setRecentRequests(requests.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.profile?.firstName}</Text>
        <Text style={styles.subtitle}>Welcome back to LifeLink</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active Requests</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.fulfilled}</Text>
          <Text style={styles.statLabel}>Fulfilled</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Button 
          title="Create Blood Request" 
          onPress={() => router.push('/(patient)/create-request')}
          size="lg"
          icon={<Ionicons name="add" size={20} color="#fff" style={{marginRight: 8}} />}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <Button 
            title="View All" 
            variant="outline" 
            size="sm" 
            onPress={() => router.push('/(patient)/my-requests')} 
          />
        </View>

        {recentRequests.length > 0 ? (
          recentRequests.map(req => (
            <RequestCard 
              key={req._id} 
              request={req} 
              onPress={() => router.push({ pathname: '/(patient)/request-detail', params: { id: req._id }})}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#374151" />
            <Text style={styles.emptyText}>You haven't made any requests yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    margin: 8,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statLabel: {
    color: '#9CA3AF',
    marginTop: 4,
    fontSize: 14,
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
});
