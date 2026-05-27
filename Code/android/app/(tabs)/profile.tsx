import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { theme } from '../../theme';

interface WorkerInfo {
  empId: string;
  fullName: string;
  role: string;
  title: string;
  gender: string;
}

export default function ProfileScreen() {
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBags: 0,
    yellowBags: 0,
    blueBags: 0
  });

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      const savedEmpId = await AsyncStorage.getItem('user_empId');
      if (savedEmpId) {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localIp = Platform.OS === 'web'
          ? '127.0.0.1'
          : (debuggerHost?.split(':')[0] || '10.0.2.2');
        
        const response = await fetch(`http://${localIp}:5000/ground_workers?empId=${savedEmpId}`);
        const workers = await response.json();
        if (workers.length > 0) {
          setWorkerInfo(workers[0]);
        }

        // Fetch user's collections to calculate today's stats dynamically
        const colResponse = await fetch(`http://${localIp}:5000/collections`);
        const collections = await colResponse.json();
        
        const getISTDateString = (dateObj: Date) => {
          const istDate = new Date(dateObj.getTime() + (5.5 * 60 * 60 * 1000));
          const year = istDate.getUTCFullYear();
          const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
          const day = String(istDate.getUTCDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const todayStr = getISTDateString(new Date());
        
        let totalBags = 0;
        let yellowBags = 0;
        let blueBags = 0;

        collections.forEach((c: any) => {
          const colDate = getISTDateString(new Date(c.timestamp));
          if (colDate === todayStr && c.empId === savedEmpId) {
            totalBags++;
            if (c.bagColor === 'Yellow') {
              yellowBags++;
            } else if (c.bagColor === 'Blue') {
              blueBags++;
            }
          }
        });

        setStats({
          totalBags,
          yellowBags,
          blueBags
        });
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of your active shift?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out Safely", 
          style: "destructive", 
          onPress: async () => {
            setIsLoading(true); 
            try {
              await AsyncStorage.clear(); 
              // Set a deliberate flag AFTER clearing to tell login screen to stay quiet
              await AsyncStorage.setItem('just_logged_out', 'yes');
            } catch (e) {
              console.error(e);
            }
            router.replace('/login');
          } 
        }
      ]
    );
  };

  if (isLoading || !workerInfo) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <FontAwesome5 name="user-alt" size={40} color={theme.primary} />
        </View>
        <Text style={styles.name}>{workerInfo.fullName}</Text>
        <Text style={styles.idBadge}>ID: {workerInfo.empId}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Identity Details</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowLabel}>System Role</Text>
          <Text style={styles.rowValue}>{workerInfo.role}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Title</Text>
          <Text style={styles.rowValue}>{workerInfo.title}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Gender</Text>
          <Text style={styles.rowValue}>{workerInfo.gender}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Collection Stats (Today)</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total Bags Collected</Text>
          <Text style={styles.rowValue}>{stats.totalBags} Bags</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>  ↳ Yellow (Infected)</Text>
          <Text style={[styles.rowValue, {color: '#ca8a04'}]}>{stats.yellowBags} Bags</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>  ↳ Blue (General)</Text>
          <Text style={[styles.rowValue, {color: theme.primary}]}>{stats.blueBags} Bags</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  profileHeader: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.border, elevation: theme.elevation, marginBottom: 15 },
  name: { fontSize: 28, fontWeight: 'bold', color: theme.textMain },
  idBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 10, color: theme.primary, fontWeight: 'bold', overflow: 'hidden' },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 20, elevation: theme.elevation },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textMain, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { fontSize: 16, color: theme.textMuted },
  rowValue: { fontSize: 16, fontWeight: 'bold', color: theme.textMain },
  divider: { height: 1, backgroundColor: theme.border, marginVertical: 10 },
  logoutBtn: { backgroundColor: theme.danger, padding: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  logoutText: { color: '#fff', fontWeight: '900', fontSize: 16 }
});
