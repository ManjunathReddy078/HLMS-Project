import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../theme';

const LINEN_TYPES = [
  "Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", 
  "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", 
  "Aprons", "Curtains"
];

const WARDS = ['ICU', 'General Ward', 'Maternity', 'Emergency', 'Surgery', 'Pediatrics', 'Oncology'];

// Mock cart of clean items in the ground worker's possession
const MOCK_CLEAN_CART = [
  { serial: "BED-849X", category: "Bedsheet" },
  { serial: "BED-850Y", category: "Bedsheet" },
  { serial: "BED-851Z", category: "Bedsheet" },
  { serial: "GWN-112A", category: "Patient Gown" },
  { serial: "TOW-300C", category: "Towel" }
];

export default function DistributeScreen() {
  const [selectedWard, setSelectedWard] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  
  const [scannerMode, setScannerMode] = useState<'ADD' | 'REMOVE'>('ADD');
  const [distributedItems, setDistributedItems] = useState<{serial: string, category: string}[]>([]);

  const handleScan = () => {
    if (scannerMode === 'ADD') {
       // Simulate scanning the whole pile they are dropping off
       const newItems = MOCK_CLEAN_CART.filter(item => !distributedItems.some(d => d.serial === item.serial));
       if (newItems.length > 0) {
          setDistributedItems([...distributedItems, ...newItems]);
          Alert.alert("Scan Successful", `Added ${newItems.length} items to drop-off queue.`);
       } else {
          Alert.alert("Already Scanned", "All items in range are already in the drop-off queue.");
       }
    } else {
       // Simulate the worker taking back one item (e.g. oversupplied a bedsheet)
       if (distributedItems.length > 0) {
          const removedItem = distributedItems[distributedItems.length - 1]; // Removes the last added item
          setDistributedItems(distributedItems.slice(0, -1));
          Alert.alert("Take-Back Successful", `Removed ${removedItem.category} (${removedItem.serial}) from drop-off queue and returned to your physical cart.`);
       } else {
          Alert.alert("Empty Queue", "There are no items currently assigned to this room to take back.");
       }
    }
  };

  const confirmDistribution = () => {
    if (!selectedWard || !floorNo || !roomNo) {
      Alert.alert("Missing Location", "Please complete Ward, Floor, and Room number fields to bind the data.");
      return;
    }
    if (distributedItems.length === 0) {
      Alert.alert("Empty Delivery", "You must scan at least one item to distribute.");
      return;
    }

    Alert.alert(
      "Drop-off Confirmed", 
      `Successfully delivered ${distributedItems.length} items to ${selectedWard} (Rm ${roomNo}).\n\nInternal Inventory updated.`,
      [{ text: "Next Room", onPress: () => { 
           // Maintain Ward and Floor but clear Room to simulate walking down the hall
           setRoomNo(''); 
           setDistributedItems([]); 
           setScannerMode('ADD');
      }}]
    );
  };

  // Group distributed items by category for the UI
  const distributedCounts: any = {};
  distributedItems.forEach(item => {
     distributedCounts[item.category] = (distributedCounts[item.category] || 0) + 1;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Distribute to Wards</Text>
      
      {/* 1. Location Entry */}
      <View style={styles.card}>
        <Text style={styles.label}>1. Drop-off Location</Text>
        <View style={styles.wardRow}>
          {WARDS.map(w => (
            <TouchableOpacity key={w} style={[styles.wardBtn, selectedWard === w && styles.wardBtnActive]} onPress={() => setSelectedWard(w)}>
              <Text style={selectedWard === w ? styles.wTextActive : styles.wText}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{flexDirection: 'row', gap: 15, marginTop: 15}}>
          <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Floor Number</Text>
             <TextInput style={styles.inputSmall} placeholder="e.g. 2" keyboardType="numeric" value={floorNo} onChangeText={setFloorNo} />
          </View>
          <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Room Number</Text>
             <TextInput style={styles.inputSmall} placeholder="e.g. 204" value={roomNo} onChangeText={setRoomNo} />
          </View>
        </View>
      </View>

      {/* 2. Dual-State Scanner Station */}
      <View style={[styles.card, scannerMode === 'REMOVE' && {borderColor: theme.danger, borderWidth: 2}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
           <Text style={[styles.label, scannerMode === 'REMOVE' && {color: theme.danger}]}>
             2. Scanner Mode: {scannerMode}
           </Text>
           <TouchableOpacity 
              style={[styles.rfidBtn, scannerMode === 'REMOVE' && {backgroundColor: theme.danger}]} 
              onPress={handleScan}>
              <MaterialCommunityIcons name="barcode-scan" size={16} color="#fff" />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>SCAN RFID</Text>
           </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
          <TouchableOpacity 
             style={[styles.toggleBtn, scannerMode === 'ADD' && {backgroundColor: theme.secondary, borderColor: theme.secondary}]} 
             onPress={() => setScannerMode('ADD')}>
            <Text style={[styles.toggleText, scannerMode === 'ADD' && {color: '#fff'}]}>ADD TO ROOM</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={[styles.toggleBtn, scannerMode === 'REMOVE' && {backgroundColor: theme.danger, borderColor: theme.danger}]} 
             onPress={() => setScannerMode('REMOVE')}>
            <Text style={[styles.toggleText, scannerMode === 'REMOVE' && {color: '#fff'}]}>TAKE BACK (REMOVE)</Text>
          </TouchableOpacity>
        </View>

        {scannerMode === 'REMOVE' && (
           <Text style={{fontSize: 12, color: theme.danger, fontWeight: 'bold', marginBottom: 5}}>
             *Warning: Scanning items now will violently deduct them from the active drop-off queue and return them to your cart.
           </Text>
        )}
      </View>

      {/* 3. Distributed Inventory Cart */}
      <View style={styles.card}>
        <Text style={styles.label}>3. Active Drop-off Queue</Text>
        <Text style={{fontSize: 13, color: theme.textMuted, marginBottom: 15}}>Items officially mapped to this room.</Text>

        {LINEN_TYPES.map(item => {
           const qty = distributedCounts[item] || 0;
           return (
             <View key={item} style={styles.inputGroup}>
               <Text style={styles.itemLabel}>{item}</Text>
               <TextInput
                 style={[styles.input, {backgroundColor: '#e2e8f0', color: theme.textMuted}]}
                 editable={false}
                 placeholder="0"
                 value={qty.toString()}
               />
             </View>
           );
        })}

        <View style={{height: 1, backgroundColor: theme.border, marginVertical: 15}} />
        <Text style={{fontWeight: '900', fontSize: 16, textAlign: 'right', color: theme.secondary}}>
          TOTAL CLEAN DELIVERED: {distributedItems.length}
        </Text>

        <TouchableOpacity style={styles.submitBtn} onPress={confirmDistribution}>
          <FontAwesome5 name="check-circle" size={20} color="#fff" />
          <Text style={styles.submitText}>Confirm Ward Drop-off</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 60}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginBottom: 15, marginTop: 5 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  label: { fontSize: 18, fontWeight: '800', color: theme.textMain, marginBottom: 15 },
  subLabel: { fontSize: 13, fontWeight: '700', color: theme.textMuted, marginBottom: 5 },
  wardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  wardBtn: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 2, borderColor: theme.border, borderRadius: 8 },
  wardBtnActive: { borderColor: theme.secondary, backgroundColor: '#d1fae5' },
  wText: { color: theme.textMuted, fontWeight: '700', fontSize: 13 },
  wTextActive: { color: theme.secondary, fontWeight: '900', fontSize: 13 },
  inputSmall: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc', fontWeight: 'bold' },
  rfidBtn: { backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, borderColor: theme.border, alignItems: 'center' },
  toggleText: { color: theme.textMuted, fontWeight: '800', fontSize: 12 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemLabel: { fontWeight: '700', fontSize: 16, color: theme.textMain, flex: 1 },
  input: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 12, width: 80, fontSize: 18, textAlign: 'center', backgroundColor: '#f8fafc', fontWeight: 'bold' },
  submitBtn: { backgroundColor: theme.secondary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 10, marginTop: 25, gap: 10 },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 18 }
});
