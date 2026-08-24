import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { timeAgo } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

const RequestCard = ({ request, onPress }) => {
  if (!request) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.bloodGroupContainer}>
            <Text style={styles.bloodGroup}>{request.bloodGroup}</Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.component}>{request.component?.replace('_', ' ')}</Text>
            <View style={styles.badges}>
              <StatusBadge status={request.status} type="status" />
              <StatusBadge status={request.urgency} type="urgency" style={{marginLeft: 8}} />
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="water-outline" size={16} color="#9CA3AF" />
            <Text style={styles.footerText}>
              {request.reservedQuantity || 0} / {request.quantity} units
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text style={styles.footerText}>{timeAgo(request.createdAt)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
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
  badges: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default RequestCard;
