import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { theme } from '../../theme';

interface LogItem {
  id: string;
  timestamp: string;
  action: 'Collected' | 'Dispatched' | 'Returned' | 'Distributed';
  title: string;
  detail: string;
}

export default function ShiftRecordsScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getApiUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localIp = Platform.OS === 'web'
      ? '127.0.0.1'
      : (debuggerHost?.split(':')[0] || '10.0.2.2');
    return `http://${localIp}:5000`;
  };

  const fetchLogs = async () => {
    try {
      const API_URL = getApiUrl();
      const savedEmpId = await AsyncStorage.getItem('user_empId');

      if (!savedEmpId) return;

      // Fetch all endpoints in parallel
      const [colRes, dispRes, retRes, distRes] = await Promise.all([
        fetch(`${API_URL}/collections`),
        fetch(`${API_URL}/dispatches`),
        fetch(`${API_URL}/returns`),
        fetch(`${API_URL}/distributions`)
      ]);

      const collections = await colRes.json();
      const dispatches = await dispRes.json();
      const returns = await retRes.json();
      const distributions = await distRes.json();

      const combinedLogs: LogItem[] = [];

      // 1. Process Collections for this employee
      collections.forEach((c: any) => {
        if (c.empId === savedEmpId) {
          combinedLogs.push({
            id: `col-${c.id || c._id}`,
            timestamp: c.timestamp,
            action: 'Collected',
            title: c.ward || 'Unknown Ward',
            detail: `${c.items ? c.items.length : 0} items (${c.bagColor} Bag #${c.bagId})`
          });
        }
      });

      // 2. Process Dispatches for this employee
      dispatches.forEach((d: any) => {
        if (d.empId === savedEmpId) {
          combinedLogs.push({
            id: `disp-${d.id || d._id}`,
            timestamp: d.timestamp,
            action: 'Dispatched',
            title: d.vendor || 'Unknown Vendor',
            detail: `Outbound Challan: ${d.bags ? d.bags.length : 0} bags (${d.totalWeight || d.weight} kg) - ₹${(d.totalCost || 0).toFixed(2)}`
          });
        }
      });

      // 3. Process Returns for this employee
      returns.forEach((r: any) => {
        if (r.empId === savedEmpId) {
          const statsStr = r.stats
            ? `${r.stats.receivedCount} clean, ${r.stats.damagedCount} damaged, ${r.stats.missingCount} missing`
            : 'Reconciled';
          combinedLogs.push({
            id: `ret-${r.id || r._id}`,
            timestamp: r.timestamp,
            action: 'Returned',
            title: r.vendor || 'Unknown Vendor',
            detail: `Inbound Challan: ${statsStr} (${r.receivedWeight || 0} kg)`
          });
        }
      });

      // 4. Process Distributions for this employee
      distributions.forEach((d: any) => {
        if (d.empId === savedEmpId) {
          combinedLogs.push({
            id: `dist-${d.id || d._id}`,
            timestamp: d.timestamp,
            action: 'Distributed',
            title: d.ward || 'Unknown Ward',
            detail: `Delivered ${d.items ? d.items.length : 0} clean items (Room ${d.room}) ${d.sosId ? '[SOS]' : ''}`
          });
        }
      });

      // Sort newest first and limit to the latest 10 actions
      combinedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const latestTen = combinedLogs.slice(0, 10);

      setLogs(latestTen);
    } catch (e) {
      console.error("Failed to fetch audit logs", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchLogs();
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return 'NA';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Collected': return theme.primary;
      case 'Dispatched': return '#f59e0b';
      case 'Returned': return theme.secondary;
      case 'Distributed': return '#8b5cf6';
      default: return theme.textMuted;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Collected': return 'sack';
      case 'Dispatched': return 'truck';
      case 'Returned': return 'clipboard-check';
      case 'Distributed': return 'hand-holding-medical';
      default: return 'history';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 15, color: theme.textMuted }}>Fetching audit logs...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.primary]} />
      }
    >
      <Text style={styles.title}>Audit Logs</Text>
      <Text style={styles.subtitle}>Latest 10 actions recorded by your worker ID.</Text>

      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={48} color={theme.textMuted} />
          <Text style={styles.emptyText}>No actions recorded for your employee ID yet.</Text>
        </View>
      ) : (
        <View style={styles.timeline}>
          {logs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.timeCol}>
                <Text style={styles.time}>{formatTime(log.timestamp)}</Text>
                <Text style={styles.date}>{formatDate(log.timestamp)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.actionCol}>
                <Text style={[styles.actionTag, { color: getActionColor(log.action) }]}>
                  {log.action.toUpperCase()}
                </Text>
                <Text style={styles.wardText}>{log.title}</Text>
                <Text style={styles.detailText}>{log.detail}</Text>
              </View>
              <View style={styles.iconBox}>
                {log.action === 'Collected' || log.action === 'Returned' ? (
                  <MaterialCommunityIcons name={getActionIcon(log.action) as any} size={24} color={getActionColor(log.action)} />
                ) : (
                  <FontAwesome5 name={getActionIcon(log.action) as any} size={20} color={getActionColor(log.action)} />
                )}
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain },
  subtitle: { fontSize: 14, color: theme.textMuted, marginBottom: 20, marginTop: 5 },
  timeline: { gap: 15 },
  logCard: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 15, flexDirection: 'row', elevation: theme.elevation },
  timeCol: { width: 75, justifyContent: 'center' },
  time: { fontWeight: 'bold', color: theme.textMain, fontSize: 13 },
  date: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  divider: { width: 4, backgroundColor: theme.border, borderRadius: 2, marginHorizontal: 10 },
  actionCol: { flex: 1, justifyContent: 'center' },
  actionTag: { fontWeight: '900', fontSize: 12, marginBottom: 2 },
  wardText: { fontWeight: 'bold', fontSize: 16, color: theme.textMain },
  detailText: { fontSize: 14, color: theme.textMuted, marginTop: 2 },
  iconBox: { justifyContent: 'center', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyText: { color: theme.textMuted, marginTop: 10, fontSize: 15, fontWeight: '600', textAlign: 'center' }
});
