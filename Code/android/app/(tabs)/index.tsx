import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';

export default function HomeDashboard() {
  const shiftStats = {
    bagsCollected: 12,
    weightDispatched: 45.5,
    sessionsCompleted: 4
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsPanel}>
        <Text style={styles.statsHeader}>TODAY STATS</Text>
        <Text style={styles.statsSub}>12th Aug | Hospital Laundry Management</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Text style={styles.metricTitle}>Total Collected</Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: theme.primary, backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>11 Bags Total</Text>
          </View>
          <Text style={styles.metricValue}>142 total items</Text>
          
          <View style={{ flexDirection: 'column', gap: 8, marginTop: 12 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#facc15' }} />
                <Text style={[styles.metricSub, {fontWeight: '700'}]}>3 Yellow</Text>
                <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>→ 40 infected items</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.primary }} />
                <Text style={[styles.metricSub, {fontWeight: '700'}]}>8 Blue</Text>
                <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>→ 102 soiled items</Text>
             </View>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Outbound Dispatch</Text>
          <Text style={styles.metricValue}>452.5 kg</Text>
          <Text style={styles.metricSub}>Sent to Vendor A | 08:30 AM</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Shift Workflow Actions</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={() => router.push('/(tabs)/collect')}>
          <MaterialIcons name="local-laundry-service" size={32} color="#fff" />
          <Text style={styles.actionText}>Collect Wards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#3b82f6'}]} onPress={() => router.push('/(tabs)/dispatch')}>
          <MaterialCommunityIcons name="truck-delivery" size={32} color="#fff" />
          <Text style={styles.actionText}>Vendor Dispatch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.accent}]} onPress={() => router.push('/(tabs)/return')}>
          <MaterialCommunityIcons name="clipboard-check" size={32} color="#fff" />
          <Text style={styles.actionText}>Receive Clean Laundry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.secondary}]} onPress={() => router.push('/(tabs)/distribute')}>
          <FontAwesome5 name="hand-holding-medical" size={28} color="#fff" />
          <Text style={styles.actionText}>Distribute Wards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {width: '100%', backgroundColor: '#475569', flexDirection: 'row', gap: 15}]} onPress={() => router.push('/(tabs)/records')}>
          <MaterialCommunityIcons name="history" size={28} color="#fff" />
          <Text style={[styles.actionText, {marginTop: 0}]}>View Audit Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {width: '100%', backgroundColor: theme.danger, flexDirection: 'row', gap: 15}]} onPress={() => router.push('/(tabs)/help')}>
          <MaterialIcons name="live-help" size={28} color="#fff" />
          <Text style={[styles.actionText, {marginTop: 0}]}>Help & Supervisor SOS</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 20 },
  statsPanel: { marginTop: 10, marginBottom: 20, backgroundColor: '#0f172a', padding: 20, borderRadius: theme.radius, elevation: 5 },
  statsHeader: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1 },
  statsSub: { fontSize: 14, color: '#94a3b8', marginTop: 5 },
  metricsGrid: { flexDirection: 'column', gap: 15, marginBottom: 30 },
  metricCard: { backgroundColor: theme.card, padding: 20, borderRadius: theme.radius, elevation: theme.elevation, alignItems: 'flex-start' },
  metricTitle: { fontSize: 15, fontWeight: '700', color: theme.textMuted },
  metricValue: { fontSize: 28, fontWeight: '900', color: theme.textMain, marginTop: 5 },
  metricSub: { fontSize: 14, color: theme.textMuted },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.textMain, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  actionBtn: { width: '47%', padding: 20, borderRadius: theme.radius, alignItems: 'center', justifyContent: 'center', elevation: theme.elevation },
  actionText: { color: '#fff', fontWeight: 'bold', marginTop: 12, textAlign: 'center' }
});
