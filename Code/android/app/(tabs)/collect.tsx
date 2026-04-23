import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const LINEN_TYPES = [
  "Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", 
  "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", 
  "Aprons", "Curtains"
];

const WARDS = ['General Ward', 'ICU', 'OT', 'Labour Ward', 'NICU', 'Maternity', 'Emergency'];

// Simulated IoT Tag Data grouped by Category
const MOCK_IOT_DATA: any = {
  "Bedsheet": [
    { sNo: 1, serial: "#849-2A-991X", color: "White", status: "Verified" },
    { sNo: 2, serial: "#849-2A-992Y", color: "White", status: "Verified" },
    { sNo: 3, serial: "#849-2A-993Z", color: "Blue", status: "Verified" },
    { sNo: 4, serial: "#849-2A-994W", color: "White", status: "Verified" },
    { sNo: 5, serial: "#849-2A-995V", color: "White", status: "Verified" }
  ],
  "Patient Gown": [
    { sNo: 1, serial: "#112-9B-104A", color: "Green", status: "Verified" },
    { sNo: 2, serial: "#112-9B-105B", color: "Green", status: "Verified" }
  ]
};

export default function CollectScreen() {
  const [selectedWard, setSelectedWard] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [bagId, setBagId] = useState('');
  const [quantities, setQuantities] = useState<any>({});
  const [selectedBag, setSelectedBag] = useState<'Yellow' | 'Blue' | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Bedsheet');

  const simulateRFIDScan = () => {
    // Simulating auto-populating counts from the Handheld RFID Scanner
    const newCounts: any = {};
    Object.keys(MOCK_IOT_DATA).forEach(category => {
      newCounts[category] = MOCK_IOT_DATA[category].length.toString();
    });
    setQuantities(newCounts);
    Alert.alert("RFID Scan Complete", "Linen serials successfully read and counted.");
  };

  const updateQuantity = (item: string, qty: string) => {
    setQuantities(prev => ({ ...prev, [item]: qty }));
  };

  const calculateTotal = () => {
    return Object.values(quantities).reduce((a: any, b: any) => a + (parseInt(b) || 0), 0);
  };

  const handleCollection = () => {
    if (!selectedWard || !floorNo || !roomNo) {
      Alert.alert("Missing Location", "Please select a ward and enter Floor/Room numbers.");
      return;
    }
    const total = calculateTotal();
    if (total === 0) {
      Alert.alert("Empty Input", "You must enter the count for at least one linen type.");
      return;
    }
    if (!selectedBag || !bagId) {
      Alert.alert("Missing Bag Info", "Please select a bag color and enter the physical Bag ID number.");
      return;
    }

    const currentDateTime = new Date().toLocaleString();
    const bagType = selectedBag === 'Yellow' ? "Infected/Soiled" : "General/Wet";

    Alert.alert(
      "Collection Verified",
      `Date & Time: ${currentDateTime}\nLocation: ${selectedWard} (Floor ${floorNo}, Room ${roomNo})\nPacked ${total} items into ${selectedBag} Bag #${bagId}.\n\nRFID Data Logged successfully.`,
      [{ text: "Continue Next Room", onPress: () => {
          setQuantities({});
          setSelectedWard('');
          setFloorNo('');
          setRoomNo('');
          setSelectedBag(null);
          setBagId('');
      }}]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Physical Linen Collection</Text>
      
      {/* Container 1: Location */}
      <View style={styles.card}>
        <Text style={styles.label}>1. Select Target Location</Text>
        <View style={styles.wardRow}>
          {WARDS.map(w => (
            <TouchableOpacity key={w} style={[styles.wardBtn, selectedWard === w && styles.wardBtnActive]} onPress={() => setSelectedWard(w)}>
              <Text style={selectedWard === w ? styles.wardBtnTextActive : styles.wardBtnText}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flexDirection: 'row', gap: 15, marginTop: 15}}>
           <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Floor No.</Text>
             <TextInput style={styles.inputSmall} placeholder="e.g. 2" keyboardType="numeric" value={floorNo} onChangeText={setFloorNo} />
           </View>
           <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Room No.</Text>
             <TextInput style={styles.inputSmall} placeholder="e.g. 204" keyboardType="default" value={roomNo} onChangeText={setRoomNo} />
           </View>
        </View>
      </View>

      {/* Container 2: Inventory */}
      <View style={styles.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
          <Text style={styles.label}>2. Physical Inventory</Text>
          <TouchableOpacity style={styles.rfidBtn} onPress={simulateRFIDScan}>
            <MaterialCommunityIcons name="barcode-scan" size={16} color="#fff" />
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>SCAN RFID</Text>
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 13, color: theme.textMuted, marginBottom: 15}}>*Counts are locked. Use Handheld Scanner to populate.</Text>
        
        {LINEN_TYPES.map(item => (
          <View key={item} style={styles.inputGroup}>
            <Text style={styles.bagLabel}>{item}</Text>
            <TextInput
              style={[styles.inputQty, {backgroundColor: '#e2e8f0', color: theme.textMuted}]}
              editable={false}
              placeholder="0"
              value={quantities[item] || ''}
            />
          </View>
        ))}
        
        <View style={{height: 1, backgroundColor: theme.border, marginVertical: 15}} />
        <Text style={{fontWeight: '900', fontSize: 16, textAlign: 'right', color: theme.textMain}}>
          TOTAL: {calculateTotal()} items
        </Text>
      </View>

      {/* Container 3: IoT Metadata Placeholder */}
      <View style={styles.card}>
        <Text style={styles.label}>3. Scanned Item Metadata (IoT)</Text>
        <Text style={{fontSize: 13, color: theme.textMuted, marginBottom: 10}}>*Live data syncs when physical RFID cart is paired.</Text>
        
        {Object.keys(MOCK_IOT_DATA).map((category) => (
          <View key={category} style={styles.accordionContainer}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setExpandedCategory(expandedCategory === category ? null : category)}>
              <Text style={styles.accordionTitle}>Category: {category}</Text>
              <MaterialCommunityIcons name={expandedCategory === category ? "chevron-up" : "chevron-down"} size={24} color={theme.primary} />
            </TouchableOpacity>
            
            {expandedCategory === category && (
              <ScrollView horizontal={true} style={styles.tableScroll}>
                <View style={styles.table}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableCellHeader, {width: 50}]}>S.No</Text>
                    <Text style={[styles.tableCellHeader, {width: 140}]}>Serial No.</Text>
                    <Text style={[styles.tableCellHeader, {width: 80}]}>Color</Text>
                    <Text style={[styles.tableCellHeader, {width: 100}]}>Status</Text>
                  </View>
                  <ScrollView style={{maxHeight: 150}} nestedScrollEnabled={true}>
                    {MOCK_IOT_DATA[category].map((item: any, idx: number) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={[styles.tableCell, {width: 50}]}>{item.sNo}</Text>
                        <Text style={[styles.tableCell, {width: 140}]}>{item.serial}</Text>
                        <Text style={[styles.tableCell, {width: 80}]}>{item.color}</Text>
                        <Text style={[styles.tableCell, {width: 100, color: theme.secondary, fontWeight: 'bold'}]}>{item.status}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            )}
          </View>
        ))}
      </View>

      {/* Container 4: Bag Selection */}
      <View style={styles.card}>
        <Text style={styles.label}>4. Manual Bag Assignment</Text>
        
        <Text style={styles.subLabel}>Physical Bag ID Number</Text>
        <TextInput 
           style={[styles.inputSmall, {marginBottom: 15}]} 
           placeholder="e.g. BAG-42" 
           autoCapitalize="characters"
           value={bagId} 
           onChangeText={setBagId} 
        />

        <Text style={styles.subLabel}>Select Bag Color Protocol</Text>
        <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
          <TouchableOpacity 
             style={[styles.bagToggleBtn, selectedBag === 'Yellow' && {backgroundColor: '#facc15', borderColor: '#ca8a04'}]} 
             onPress={() => setSelectedBag('Yellow')}>
            <MaterialCommunityIcons name="sack" size={24} color={selectedBag === 'Yellow' ? '#fff' : '#ca8a04'} />
            <Text style={[styles.toggleText, selectedBag === 'Yellow' && {color: '#fff'}]}>YELLOW BAG</Text>
          </TouchableOpacity>

          <TouchableOpacity 
             style={[styles.bagToggleBtn, selectedBag === 'Blue' && {backgroundColor: theme.primary, borderColor: theme.primary}]} 
             onPress={() => setSelectedBag('Blue')}>
            <MaterialCommunityIcons name="sack" size={24} color={selectedBag === 'Blue' ? '#fff' : theme.primary} />
            <Text style={[styles.toggleText, selectedBag === 'Blue' && {color: '#fff'}]}>BLUE BAG</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Final Button */}
      <TouchableOpacity style={styles.finalSubmitBtn} onPress={handleCollection}>
         <FontAwesome5 name="check-circle" size={20} color="#fff" />
         <Text style={styles.finalSubmitText}>CONFIRM COLLECTION</Text>
      </TouchableOpacity>

      <View style={{height: 60}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginBottom: 20 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  label: { fontSize: 18, fontWeight: '800', color: theme.textMain, marginBottom: 15 },
  subLabel: { fontSize: 13, fontWeight: '700', color: theme.textMuted, marginBottom: 5 },
  rfidBtn: { backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  wardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wardBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 2, borderColor: theme.border },
  wardBtnActive: { backgroundColor: '#e0f2fe', borderColor: theme.primary },
  wardBtnText: { color: theme.textMuted, fontWeight: '700', fontSize: 14 },
  wardBtnTextActive: { color: theme.primary, fontWeight: '900', fontSize: 14 },
  inputSmall: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc', fontWeight: 'bold' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  bagLabel: { fontWeight: '700', fontSize: 16, color: theme.textMain, flex: 1 },
  inputQty: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 10, width: 70, fontSize: 16, textAlign: 'center', backgroundColor: '#f8fafc', fontWeight: 'bold' },
  accordionContainer: { marginBottom: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 8, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 12 },
  accordionTitle: { fontWeight: '800', fontSize: 15, color: theme.primary },
  tableScroll: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: theme.border },
  table: { minWidth: 370 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
  tableCellHeader: { fontWeight: '700', fontSize: 13, color: theme.textMuted },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tableCell: { fontSize: 13, color: theme.textMain },
  bagToggleBtn: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 2, borderColor: theme.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5 },
  toggleText: { color: theme.textMuted, fontWeight: '900', fontSize: 14, textAlign: 'center', marginTop: 5 },
  finalSubmitBtn: { backgroundColor: theme.secondary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 10, marginBottom: 20, gap: 10 },
  finalSubmitText: { color: '#fff', fontWeight: '900', fontSize: 18 }
});
