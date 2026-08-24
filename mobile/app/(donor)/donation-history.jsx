import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import DonationCard from '../../components/donor/DonationCard';
import * as donorService from '../../services/donor.service';
import Card from '../../components/common/Card';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../utils/helpers';

export default function DonationHistoryScreen() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await donorService.getDonationHistory();
      setDonations(res.donations || []);
      
      const profileRes = await donorService.getProfile();
      setStats({
        total: profileRes.profile.totalDonations,
        lastDate: profileRes.profile.lastDonationDate
      });
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.total || 0}</Text>
                <Text style={styles.statLabel}>Total Donations</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {stats.lastDate ? formatDate(stats.lastDate) : 'Never'}
                </Text>
                <Text style={styles.statLabel}>Last Donation</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }) => <DonationCard donation={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="water-outline" size={48} color="#374151" />
            <Text style={styles.emptyText}>No donation history yet</Text>
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    color: '#9CA3AF',
    marginTop: 4,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
});
