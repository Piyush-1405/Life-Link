import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor, getUrgencyColor } from '../../utils/helpers';

const StatusBadge = ({ status, type = 'status', style }) => {
  const color = type === 'status' ? getStatusColor(status) : getUrgencyColor(status);
  
  // Format string: DONOR_ACCEPTED -> Donor Accepted
  const formatText = (text) => {
    if (!text) return '';
    return text.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${color}20`, borderColor: color }, style]}>
      <Text style={[styles.text, { color }]}>
        {formatText(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
