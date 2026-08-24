import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

const DonationCard = ({ donation }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatDate(donation.donationDate)}</Text>
          <Text style={styles.hospital}>{donation.bloodBank?.name || 'Blood Bank'}</Text>
        </View>
        <StatusBadge status={donation.status} />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={16} color="#DC2626" />
          <Text style={styles.detailText}>{donation.bloodGroup}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="flask" size={16} color="#3B82F6" />
          <Text style={styles.detailText}>{donation.componentType?.replace('_', ' ')}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="scale" size={16} color="#10B981" />
          <Text style={styles.detailText}>{donation.volumeCollected || 0} ml</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  date: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hospital: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#D1D5DB',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DonationCard;
