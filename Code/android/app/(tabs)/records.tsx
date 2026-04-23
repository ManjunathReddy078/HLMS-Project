import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function ShiftRecordsScreen() {
  // Mock data representing previous completed shift actions
  const historyLog = [
    { id: '1', time: '08:30 AM', action: 'Collected', ward: 'ICU Ward', detail: '45 items (Yellow Bag)' },
    { id: '2', time: '09:15 AM', action: 'Collected', ward: 'General Ward', detail: '100 items (Blue Bag)' },
    { id: '3', time: '10:00 AM', action: 'Dispatched', ward: 'Loading Bay', detail: 'Vendor A (145.5 kg)' },
    { id: '4', time: '11:45 AM', action: 'Distributed', ward: 'Surgery', detail: '30 Clean items Dropped' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Audit Logs</Text>
      <Text style={styles.subtitle}>Latest 10 actions recorded by your worker ID.</Text>

      <View style={styles.timeline}>
        {historyLog.map((log, index) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.timeCol}>
              <Text style={styles.time}>{log.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.actionCol}>
              <Text style={[styles.actionTag, 
                log.action === 'Collected' ? {color: theme.primary} : 
                log.action === 'Dispatched' ? {color: '#f59e0b'} : {color: theme.secondary}
              ]}>{log.action.toUpperCase()}</Text>
              <Text style={styles.wardText}>{log.ward}</Text>
              <Text style={styles.detailText}>{log.detail}</Text>
            </View>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.secondary} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain },
  subtitle: { fontSize: 15, color: theme.textMuted, marginBottom: 20, marginTop: 5 },
  timeline: { gap: 15 },
  logCard: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 15, flexDirection: 'row', elevation: theme.elevation },
  timeCol: { width: 75, justifyContent: 'center' },
  time: { fontWeight: 'bold', color: theme.textMain, fontSize: 13 },
  divider: { width: 4, backgroundColor: theme.border, borderRadius: 2, marginHorizontal: 10 },
  actionCol: { flex: 1, justifyContent: 'center' },
  actionTag: { fontWeight: '900', fontSize: 12, marginBottom: 2 },
  wardText: { fontWeight: 'bold', fontSize: 16, color: theme.textMain },
  detailText: { fontSize: 14, color: theme.textMuted, marginTop: 2 },
  iconBox: { justifyContent: 'center', marginLeft: 10 }
});
