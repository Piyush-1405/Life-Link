import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.profile.firstName?.[0]}{user.profile.lastName?.[0]}
          </Text>
        </View>
        <Text style={styles.name}>{user.profile.firstName} {user.profile.lastName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Card title="Personal Information" style={styles.section}>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>{user.profile.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="water" size={20} color="#DC2626" />
          <Text style={styles.infoText}>Blood Group: {user.profile.bloodGroup}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="male-female" size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>Gender: {user.profile.gender}</Text>
        </View>
      </Card>

      <Button 
        title="Logout" 
        variant="outline" 
        onPress={logout} 
        style={styles.logoutBtn}
        icon="log-out"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DC2626',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoText: {
    color: '#E5E7EB',
    fontSize: 16,
    marginLeft: 16,
  },
  logoutBtn: {
    marginTop: 16,
    borderColor: '#6B7280',
  },
});
