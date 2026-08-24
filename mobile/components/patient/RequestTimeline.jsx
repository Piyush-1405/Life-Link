import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor, formatDateTime } from '../../utils/helpers';

const RequestTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) return null;

  // Sort timeline by timestamp ascending
  const sortedTimeline = [...timeline].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <View style={styles.container}>
      {sortedTimeline.map((item, index) => {
        const isLast = index === sortedTimeline.length - 1;
        const color = getStatusColor(item.status);
        
        return (
          <View key={index} style={styles.item}>
            <View style={styles.leftCol}>
              <View style={[styles.dot, { backgroundColor: color }, isLast && styles.dotPulsing]} />
              {!isLast && <View style={[styles.line, { backgroundColor: color }]} />}
            </View>
            <View style={styles.content}>
              <Text style={[styles.status, { color }]}>{item.status.replace(/_/g, ' ')}</Text>
              <Text style={styles.time}>{formatDateTime(item.timestamp)}</Text>
              {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
  },
  leftCol: {
    width: 30,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 2,
  },
  dotPulsing: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 24,
    paddingLeft: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  time: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  notes: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 4,
  },
});

export default RequestTimeline;
