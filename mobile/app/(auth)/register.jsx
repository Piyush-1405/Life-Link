import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { BLOOD_GROUPS, COMPONENTS } from '../../utils/constants';

export default function RegisterScreen() {
  const [role, setRole] = useState('DONOR'); // PATIENT or DONOR
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [gender, setGender] = useState('MALE'); // MALE, FEMALE, OTHER
  const [weight, setWeight] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = {
        email,
        password,
        role,
        profile: {
          firstName,
          lastName,
          phone,
          bloodGroup,
          gender
        }
      };
      
      if (role === 'DONOR') {
        data.profile.weight = Number(weight);
        if(!data.profile.weight) {
          Alert.alert('Error', 'Weight is required for donors');
          setLoading(false);
          return;
        }
      }

      const res = await register(data);
      if (res.user.role === 'PATIENT') {
        router.replace('/(patient)/dashboard');
      } else {
        router.replace('/(donor)/dashboard');
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.roleSelector}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'DONOR' && styles.roleBtnActive]}
          onPress={() => setRole('DONOR')}
        >
          <Text style={[styles.roleText, role === 'DONOR' && styles.roleTextActive]}>I want to Donate</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'PATIENT' && styles.roleBtnActive]}
          onPress={() => setRole('PATIENT')}
        >
          <Text style={[styles.roleText, role === 'PATIENT' && styles.roleTextActive]}>I need Blood</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Input label="First Name" value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={styles.halfWidth}>
          <Input label="Last Name" value={lastName} onChangeText={setLastName} />
        </View>
      </View>

      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.sectionLabel}>Blood Group</Text>
      <View style={styles.grid}>
        {BLOOD_GROUPS.map(bg => (
          <TouchableOpacity 
            key={bg} 
            style={[styles.gridItem, bloodGroup === bg && styles.gridItemActive]}
            onPress={() => setBloodGroup(bg)}
          >
            <Text style={[styles.gridText, bloodGroup === bg && styles.gridTextActive]}>{bg}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Gender</Text>
      <View style={styles.row}>
        {['MALE', 'FEMALE', 'OTHER'].map(g => (
          <TouchableOpacity 
            key={g} 
            style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {role === 'DONOR' && (
        <Input 
          label="Weight (kg)" 
          value={weight} 
          onChangeText={setWeight} 
          keyboardType="numeric" 
        />
      )}

      <Button title="Register" onPress={handleRegister} loading={loading} size="lg" style={styles.registerBtn} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  roleBtnActive: {
    backgroundColor: '#DC2626',
  },
  roleText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  gridItem: {
    width: '25%',
    padding: 4,
  },
  gridText: {
    backgroundColor: '#1F2937',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontWeight: '600',
  },
  gridItemActive: {},
  gridTextActive: {
    backgroundColor: '#DC2626',
    color: '#fff',
    borderColor: '#DC2626',
  },
  genderBtn: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  genderBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  genderText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#fff',
  },
  registerBtn: {
    marginTop: 16,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  footerLink: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
