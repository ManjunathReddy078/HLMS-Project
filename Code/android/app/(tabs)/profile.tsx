import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';

export default function ProfileScreen() {
  const workerInfo = {
    name: "John Doe",
    id: "EMP-8042",
    role: "Ground Operations (Linen)",
    assignedZone: "Main Hospital Block"
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of your active shift?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out Safely", style: "destructive", onPress: () => router.replace('/login') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <FontAwesome5 name="user-alt" size={40} color={theme.primary} />
        </View>
        <Text style={styles.name}>{workerInfo.name}</Text>
        <Text style={styles.idBadge}>ID: {workerInfo.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Identity Details</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Official Role</Text>
          <Text style={styles.rowValue}>{workerInfo.role}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Assigned Zone</Text>
          <Text style={styles.rowValue}>{workerInfo.assignedZone}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Collection Stats (Today)</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total Bags Collected</Text>
          <Text style={styles.rowValue}>14 Bags</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>  ↳ Yellow (Infected)</Text>
          <Text style={[styles.rowValue, {color: '#ca8a04'}]}>5 Bags</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>  ↳ Blue (General)</Text>
          <Text style={[styles.rowValue, {color: theme.primary}]}>9 Bags</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Distribution Stats (Today)</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Clean Items Delivered</Text>
          <Text style={styles.rowValue}>412 Items</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Wards Serviced</Text>
          <Text style={styles.rowValue}>6 Wards</Text>
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
  divider: { height: 1, backgroundColor: theme.border, my: 10 },
  logoutBtn: { backgroundColor: theme.danger, padding: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  logoutText: { color: '#fff', fontWeight: '900', fontSize: 16 }
});
