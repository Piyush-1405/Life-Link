import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BLOOD_GROUPS, COMPONENTS, URGENCY_LEVELS, SEARCH_RADII } from '../../utils/constants';
import Button from '../common/Button';
import LocationPicker from '../common/LocationPicker';
import Input from '../common/Input';
import Card from '../common/Card';

const RequestForm = ({ onSubmit, loading }) => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [component, setComponent] = useState('WHOLE_BLOOD');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('NORMAL');
  const [searchRadius, setSearchRadius] = useState(10);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!location) newErrors.location = 'Location is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      bloodGroup,
      component,
      quantity,
      urgency,
      searchRadius,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      notes
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Blood Group" style={styles.section}>
        <View style={styles.grid}>
          {BLOOD_GROUPS.map(bg => (
            <TouchableOpacity 
              key={bg}
              style={[styles.gridItem, bloodGroup === bg && styles.gridItemActive]}
              onPress={() => { setBloodGroup(bg); setErrors({...errors, bloodGroup: null}); }}
            >
              <Text style={[styles.gridItemText, bloodGroup === bg && styles.gridItemTextActive]}>
                {bg}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}
      </Card>

      <Card title="Component" style={styles.section}>
        <View style={styles.grid}>
          {COMPONENTS.map(c => (
            <TouchableOpacity 
              key={c}
              style={[styles.gridItem, component === c && styles.gridItemActive]}
              onPress={() => setComponent(c)}
            >
              <Text style={[styles.gridItemText, component === c && styles.gridItemTextActive]}>
                {c.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="Quantity (Units)" style={styles.section}>
        <View style={styles.stepper}>
          <TouchableOpacity 
            style={styles.stepperBtn} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.stepperBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.stepperBtn} 
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card title="Urgency" style={styles.section}>
        <View style={styles.row}>
          {URGENCY_LEVELS.map(u => (
            <TouchableOpacity 
              key={u}
              style={[
                styles.pill, 
                urgency === u && styles[`pill_${u}`]
              ]}
              onPress={() => setUrgency(u)}
            >
              <Text style={[
                styles.pillText,
                urgency === u && styles.pillTextActive
              ]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      <Card title="Search Radius (km)" style={styles.section}>
        <View style={styles.row}>
          {SEARCH_RADII.map(r => (
            <TouchableOpacity 
              key={r}
              style={[styles.pill, searchRadius === r && styles.pillActive]}
              onPress={() => setSearchRadius(r)}
            >
              <Text style={[styles.pillText, searchRadius === r && styles.pillTextActive]}>
                {r} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <LocationPicker location={location} setLocation={(loc) => { setLocation(loc); setErrors({...errors, location: null}); }} />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
      </Card>

      <Card style={styles.section}>
        <Input 
          label="Notes (Optional)" 
          placeholder="Any specific instructions..." 
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={{marginBottom: 0}}
        />
      </Card>

      <Button 
        title="Submit Request" 
        onPress={handleSubmit} 
        loading={loading}
        size="lg"
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    width: '25%',
    padding: 4,
  },
  gridItemActive: {
    // handled by inner style or background color
  },
  gridItemText: {
    backgroundColor: '#1F2937',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontWeight: '600',
  },
  gridItemTextActive: {
    backgroundColor: '#DC2626',
    color: '#fff',
    borderColor: '#DC2626',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtn: {
    backgroundColor: '#1F2937',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepperValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  pillActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  pill_NORMAL: { backgroundColor: '#10B981', borderColor: '#10B981' },
  pill_URGENT: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  pill_CRITICAL: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  pillText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 12,
  },
  pillTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
  },
  submitBtn: {
    marginTop: 8,
  },
});

export default RequestForm;
