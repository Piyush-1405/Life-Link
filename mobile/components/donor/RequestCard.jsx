import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '../../utils/helpers';

const DonorRequestCard = ({ request, onAccept, onReject, showActions = true }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.bloodGroupContainer}>
          <Text style={styles.bloodGroup}>{request.bloodGroup}</Text>
        </View>
        <View style={styles.mainInfo}>
          <Text style={styles.component}>{request.component?.replace('_', ' ')}</Text>
          <StatusBadge status={request.urgency} type="urgency" />
        </View>
      </View>
      
      <View style={styles.details}>
        {request.distance && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{request.distance.toFixed(1)} km away</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>{timeAgo(request.createdAt)}</Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <Button 
            title="Decline" 
            variant="outline" 
            onPress={() => onReject(request._id)} 
            style={styles.actionBtn} 
          />
          <View style={{width: 12}} />
          <Button 
            title="Accept" 
            variant="primary" 
            onPress={() => onAccept(request._id)} 
            style={styles.actionBtn} 
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bloodGroupContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DC262620',
    borderWidth: 2,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bloodGroup: {
    color: '#DC2626',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  component: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    color: '#D1D5DB',
    marginLeft: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
  },
});

export default DonorRequestCard;
