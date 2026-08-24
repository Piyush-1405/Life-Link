import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DonorLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e', borderBottomWidth: 1, borderBottomColor: '#374151' },
      headerTintColor: '#fff',
      tabBarStyle: { backgroundColor: '#1a1a2e', borderTopWidth: 1, borderTopColor: '#374151' },
      tabBarActiveTintColor: '#DC2626',
      tabBarInactiveTintColor: '#9CA3AF',
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="available-requests" 
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="donation-history" 
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="request-detail" 
        options={{
          href: null,
          title: 'Request Details',
          headerBackTitleVisible: false
        }} 
      />
      <Tabs.Screen 
        name="availability" 
        options={{
          href: null,
          title: 'Manage Availability'
        }} 
      />
    </Tabs>
  );
}
