import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function HelpScreen() {
  const handleSOS = () => {
    Alert.alert(
      "Supervisor Alerted",
      "The Nursing Superintendent has been notified that you need physical assistance at your current location.",
      [{ text: "Understood" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Protocols & Emergency Help</Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Packing Protocols</Text>
        
        <View style={[styles.protocolBox, {borderColor: '#ca8a04', backgroundColor: '#fef9c3'}]}>
          <Text style={[styles.pTitle, {color: '#854d0e'}]}>YELLOW BAGS (INFECTED LINEN)</Text>
          <Text style={styles.pText}>Use for infected patients (e.g., TB, MRSA, MDR, Chickenpox). Ensure a manual label is attached. DO NOT mix with regular ward linen.</Text>
        </View>

        <View style={[styles.protocolBox, {borderColor: theme.primary, backgroundColor: '#e0f2fe'}]}>
          <Text style={[styles.pTitle, {color: theme.primary}]}>BLUE BAGS (SOILED LINEN)</Text>
          <Text style={styles.pText}>Use for general soiled linen mixed with blood or body fluid from regular Wards or OT. Note: OT linen must always be bagged completely separately from regular Ward linen!</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Emergency Contact</Text>
        <Text style={{color: theme.textMuted, marginBottom: 15, fontSize: 14}}>If an RFID Scanner breaks, a trolley is stuck, or you need immediate Nursing Superintendent clearance, press the SOS button.</Text>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <MaterialIcons name="phone-in-talk" size={28} color="#fff" />
          <Text style={styles.sosText}>CALL SUPERVISOR (PANIC)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginBottom: 20 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: theme.textMain },
  
  protocolBox: { borderWidth: 2, padding: 15, borderRadius: 10, marginBottom: 15, marginTop: 15 },
  pTitle: { fontWeight: '900', fontSize: 16, marginBottom: 5 },
  pText: { fontSize: 14, color: '#334155', lineHeight: 20 },
  sosButton: { backgroundColor: theme.danger, padding: 20, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  sosText: { color: '#fff', fontWeight: '900', fontSize: 16 }
});
