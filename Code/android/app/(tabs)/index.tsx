import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';
import { theme } from '../../theme';

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    totalBags: 'NA',
    yellowBags: 0,
    blueBags: 0,
    totalItems: 0,
    yellowItems: 0,
    blueItems: 0,
    totalWeight: 'NA',
    vendorA: { weight: 0, lastDate: 'NA', bags: 0 },
    vendorB: { weight: 0, lastDate: 'NA', bags: 0 }
  });

  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  useFocusEffect(
    useCallback(() => {
      fetchLiveStats();
    }, [])
  );

  const fetchLiveStats = async () => {
    try {
      const debuggerHost = Constants.expoConfig?.hostUri;
      const localIp = debuggerHost?.split(':')[0] || '10.0.2.2';
      
      // Fetch Collections
      const colRes = await fetch(`http://${localIp}:5000/collections`);
      const collections = await colRes.json();
      
      let totalBags = 0;
      let yellowBags = 0;
      let blueBags = 0;
      let totalItems = 0;
      let yellowItems = 0;
      let blueItems = 0;

      collections.forEach((c: any) => {
        totalBags++;
        if (c.bagColor === 'Yellow') {
          yellowBags++;
          yellowItems += c.items.length;
        } else if (c.bagColor === 'Blue') {
          blueBags++;
          blueItems += c.items.length;
        }
        totalItems += c.items.length;
      });

      // Fetch Dispatches
      const disRes = await fetch(`http://${localIp}:5000/dispatches`);
      const dispatches = await disRes.json();

      let totalWeight = 0;
      const vA = { weight: 0, lastDate: 'NA', bags: 0 };
      const vB = { weight: 0, lastDate: 'NA', bags: 0 };

      dispatches.forEach((d: any) => {
        const w = parseFloat(d.totalWeight || d.weight || 0);
        totalWeight += w;

        const dateStr = d.timestamp ? new Date(d.timestamp).toLocaleDateString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'NA';
        const bagCount = d.bags ? d.bags.length : 1;

        if (d.vendor === 'Vendor A') {
           vA.weight += w;
           vA.bags += bagCount;
           vA.lastDate = dateStr;
        } else if (d.vendor === 'Vendor B') {
           vB.weight += w;
           vB.bags += bagCount;
           vB.lastDate = dateStr;
        }
      });

      setStats({
        totalBags: collections.length > 0 ? totalBags.toString() : 'NA',
        yellowBags,
        blueBags,
        totalItems,
        yellowItems,
        blueItems,
        totalWeight: dispatches.length > 0 ? totalWeight.toFixed(1) : 'NA',
        vendorA: vA,
        vendorB: vB
      });

    } catch (e) {
      console.error('Failed to fetch hub stats', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsPanel}>
        <Text style={styles.statsHeader}>TODAY STATS</Text>
        <Text style={styles.statsSub}>{currentDate} | Hospital Laundry Management</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Text style={styles.metricTitle}>Total Collected</Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: theme.primary, backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              {stats.totalBags === 'NA' ? 'NA' : `${stats.totalBags} Bags`}
            </Text>
          </View>
          <Text style={styles.metricValue}>{stats.totalBags === 'NA' ? 'NA' : `${stats.totalItems} total items`}</Text>
          
          {stats.totalBags !== 'NA' && (
            <View style={{ flexDirection: 'column', gap: 8, marginTop: 12 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#facc15' }} />
                  <Text style={[styles.metricSub, {fontWeight: '700'}]}>{stats.yellowBags} Yellow</Text>
                  <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>→ {stats.yellowItems} infected items</Text>
               </View>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.primary }} />
                  <Text style={[styles.metricSub, {fontWeight: '700'}]}>{stats.blueBags} Blue</Text>
                  <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>→ {stats.blueItems} soiled items</Text>
               </View>
            </View>
          )}
        </View>

        <View style={[styles.metricCard, {flex: 1}]}>
          <Text style={styles.metricTitle}>Outbound Dispatch</Text>
          <Text style={styles.metricValue}>{stats.totalWeight === 'NA' ? 'NA' : `${stats.totalWeight} kg`}</Text>
          <Text style={styles.metricSub}>Sent to Vendors Today</Text>

          {stats.totalWeight !== 'NA' && (
            <View style={{ flexDirection: 'column', gap: 12, marginTop: 15, width: '100%' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 8 }}>
                  <View>
                     <Text style={{fontWeight: '800', color: theme.textMain}}>Vendor A</Text>
                     <Text style={{fontSize: 11, color: theme.textMuted}}>Last: {stats.vendorA.lastDate}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                     <Text style={{fontWeight: '800', color: theme.primary}}>{stats.vendorA.weight.toFixed(1)} kg</Text>
                     <Text style={{fontSize: 12, color: theme.textMuted}}>{stats.vendorA.bags} bags</Text>
                  </View>
               </View>

               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                     <Text style={{fontWeight: '800', color: theme.textMain}}>Vendor B</Text>
                     <Text style={{fontSize: 11, color: theme.textMuted}}>Last: {stats.vendorB.lastDate}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                     <Text style={{fontWeight: '800', color: '#10b981'}}>{stats.vendorB.weight.toFixed(1)} kg</Text>
                     <Text style={{fontSize: 12, color: theme.textMuted}}>{stats.vendorB.bags} bags</Text>
                  </View>
               </View>
            </View>
          )}
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
