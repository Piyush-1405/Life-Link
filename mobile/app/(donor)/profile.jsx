import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import * as donorService from '../../services/donor.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { COMPONENTS } from '../../utils/constants';

export default function DonorProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await donorService.getProfile();
        setProfile(res.profile);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!user || !profile) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.profile.firstName?.[0]}{user.profile.lastName?.[0]}
          </Text>
        </View>
        <Text style={styles.name}>{user.profile.firstName} {user.profile.lastName}</Text>
        <Text style={styles.bloodGroup}>{user.profile.bloodGroup} Donor</Text>
      </View>

      <Card title="Health Information" style={styles.section}>
        <View style={styles.infoRow}>
          <Ionicons name="scale-outline" size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>Weight: {profile.weight} kg</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="male-female" size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>Gender: {user.profile.gender}</Text>
        </View>
      </Card>

      <Card title="Eligible Components" style={styles.section}>
        {COMPONENTS.map(comp => {
          const isEligible = profile.eligibleComponents?.includes(comp);
          return (
            <View key={comp} style={styles.componentRow}>
              <Text style={styles.componentText}>{comp.replace('_', ' ')}</Text>
              <Ionicons 
                name={isEligible ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={isEligible ? "#10B981" : "#EF4444"} 
              />
            </View>
          );
        })}
      </Card>

      <Button 
        title="Logout" 
        variant="outline" 
        onPress={logout} 
        style={styles.logoutBtn}
        icon="log-out"
      />
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
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DC262620',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DC2626',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bloodGroup: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: 'bold',
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
  componentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  componentText: {
    color: '#E5E7EB',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  logoutBtn: {
    marginTop: 16,
    borderColor: '#6B7280',
  },
});
