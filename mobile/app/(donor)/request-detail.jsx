import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as requestService from '../../services/request.service';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import RequestTimeline from '../../components/patient/RequestTimeline';
import { formatDateTime } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

export default function DonorRequestDetailScreen() {
  const { id } = useLocalSearchParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await requestService.getRequest(id);
        setRequest(res.request);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading || !request) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mainCard}>
        <View style={styles.headerRow}>
          <Text style={styles.bloodGroup}>{request.bloodGroup}</Text>
          <StatusBadge status={request.status} />
        </View>
        <Text style={styles.component}>{request.component?.replace('_', ' ')}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
          <Text style={styles.infoText}>Created: {formatDateTime(request.createdAt)}</Text>
        </View>
      </Card>

      <Card title="Hospital Information" style={styles.section}>
        {request.hospitalId ? (
          <View>
            <Text style={styles.hospitalName}>{request.hospitalId.name || 'Assigned Hospital'}</Text>
            {request.hospitalId.address && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text style={styles.locationText}>{request.hospitalId.address}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.placeholderText}>Hospital not yet assigned to this request.</Text>
        )}
      </Card>

      <Card title="Timeline" style={styles.section}>
        <RequestTimeline timeline={request.timeline} />
      </Card>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
  mainCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DC262650',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bloodGroup: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  component: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    color: '#D1D5DB',
    marginLeft: 8,
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
});
