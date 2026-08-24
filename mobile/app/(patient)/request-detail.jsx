import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as requestService from '../../services/request.service';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import RequestTimeline from '../../components/patient/RequestTimeline';
import { useSocket } from '../../hooks/useSocket';
import { formatDateTime } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await requestService.getRequest(id);
      setRequest(res.request);
    } catch (error) {
      Alert.alert('Error', 'Failed to load request details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (socket && id) {
      socket.emit('join:request', id);
      
      const handleUpdate = (updatedRequest) => {
        if (updatedRequest._id === id) {
          setRequest(updatedRequest);
        }
      };
      
      socket.on('request:updated', handleUpdate);
      
      return () => {
        socket.emit('leave:request', id);
        socket.off('request:updated', handleUpdate);
      };
    }
  }, [socket, id]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: async () => {
          try {
            await requestService.cancelRequest(id);
            loadData();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel');
          }
        }}
      ]
    );
  };

  if (loading || !request) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  const isCancellable = !['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(request.status);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mainCard}>
        <View style={styles.headerRow}>
          <Text style={styles.bloodGroup}>{request.bloodGroup}</Text>
          <StatusBadge status={request.status} />
        </View>
        <Text style={styles.component}>{request.component?.replace('_', ' ')}</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Quantity Needed</Text>
            <Text style={styles.infoValue}>{request.quantity} units</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Urgency</Text>
            <StatusBadge status={request.urgency} type="urgency" />
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
          <Text style={styles.infoText}>Created: {formatDateTime(request.createdAt)}</Text>
        </View>
      </Card>

      {(request.reservedQuantity > 0 || request.fulfilledQuantity > 0) && (
        <Card title="Fulfillment Status" style={styles.section}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{request.reservedQuantity || 0}</Text>
              <Text style={styles.progressLabel}>Reserved</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressValue, {color: '#10B981'}]}>{request.fulfilledQuantity || 0}</Text>
              <Text style={styles.progressLabel}>Fulfilled</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{request.quantity}</Text>
              <Text style={styles.progressLabel}>Total Needed</Text>
            </View>
          </View>
        </Card>
      )}

      {request.notes && (
        <Card title="Notes" style={styles.section}>
          <Text style={styles.notesText}>{request.notes}</Text>
        </Card>
      )}

      <Card title="Timeline" style={styles.section}>
        <RequestTimeline timeline={request.timeline} />
      </Card>

      {isCancellable && (
        <Button 
          title="Cancel Request" 
          variant="danger" 
          onPress={handleCancel}
          style={styles.cancelBtn}
        />
      )}
      
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
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  notesText: {
    color: '#D1D5DB',
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  cancelBtn: {
    marginTop: 8,
    marginBottom: 24,
  }
});
