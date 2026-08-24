import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Switch, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import * as donorService from '../../services/donor.service';
import EligibilityBanner from '../../components/donor/EligibilityBanner';
import RequestCard from '../../components/donor/RequestCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../../hooks/useSocket';

export default function DonorDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const pData = await donorService.getProfile();
      setProfile(pData.profile);
      
      const rData = await donorService.getEligibleRequests();
      // Filter only un-responded requests for the dashboard
      setPendingRequests(rData.requests?.slice(0, 3) || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    if (socket) {
      socket.on('donor:matched', (data) => {
        // Refresh when matched with new request
        loadData();
      });
      return () => {
        socket.off('donor:matched');
      };
    }
  }, [socket]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleAvailability = async (value) => {
    try {
      await donorService.toggleAvailability(value);
      setProfile({ ...profile, isAvailable: value });
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await donorService.respondToRequest(requestId, action);
      loadData(); // Refresh list
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to respond');
    }
  };

  if (loading && !profile) return null;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.profile?.firstName}</Text>
        <Text style={styles.subtitle}>Ready to save lives?</Text>
      </View>

      <View style={styles.section}>
        <EligibilityBanner 
          isEligible={profile?.isEligible}
          nextEligibleDate={profile?.nextEligibleDate}
          isAvailable={profile?.isAvailable}
        />
      </View>

      <View style={styles.section}>
        <Card style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <View>
              <Text style={styles.availabilityTitle}>Current Status</Text>
              <Text style={styles.availabilityDesc}>
                {profile?.isAvailable ? 'Available for donations' : 'Not available'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={profile?.isAvailable ? '#fff' : '#f4f3f4'}
              onValueChange={toggleAvailability}
              value={profile?.isAvailable}
            />
          </View>
          <Button 
            title="Manage Details" 
            variant="outline" 
            size="sm"
            style={{marginTop: 12}}
            onPress={() => router.push('/(donor)/availability')}
          />
        </Card>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile?.totalDonations || 0}</Text>
          <Text style={styles.statLabel}>Total Donations</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile?.requestsAccepted || 0}</Text>
          <Text style={styles.statLabel}>Requests Accepted</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Matches</Text>
          <Button 
            title="View All" 
            variant="outline" 
            size="sm" 
            onPress={() => router.push('/(donor)/available-requests')} 
          />
        </View>

        {pendingRequests.length > 0 ? (
          pendingRequests.map(req => (
            <RequestCard 
              key={req._id} 
              request={req} 
              onAccept={(id) => handleAction(id, 'ACCEPTED')}
              onReject={(id) => handleAction(id, 'DECLINED')}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#374151" />
            <Text style={styles.emptyText}>No pending requests right now</Text>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  availabilityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  availabilityDesc: {
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
