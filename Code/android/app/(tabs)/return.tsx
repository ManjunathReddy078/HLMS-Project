import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../theme';

const MOCK_EXPECTED = [
  { serial: "BED-849X", category: "Bedsheet", ward: "ICU", room: "204", bag: "BAG-42" },
  { serial: "BED-850Y", category: "Bedsheet", ward: "ICU", room: "204", bag: "BAG-42" },
  { serial: "GWN-112A", category: "Patient Gown", ward: "General Ward", room: "101", bag: "BAG-19" },
  { serial: "GWN-113B", category: "Patient Gown", ward: "General Ward", room: "101", bag: "BAG-19" }
];

const MOCK_SCANNED_SERIALS = ["BED-849X", "BED-850Y", "GWN-112A"]; // GWN-113B is officially missing

const LINEN_TYPES = [
  "Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", 
  "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", 
  "Aprons", "Curtains"
];

export default function ReturnScreen() {
  const [phase, setPhase] = useState<'SCANNING' | 'REPORT'>('SCANNING');
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>('Bedsheet');

  // Using the fixed global hospital linen categories
  const categories = LINEN_TYPES;

  const simulateRFIDScan = () => {
    setScannedItems(prevScanned => {
      // First massive bulk scan: grabs most items but simulates missing one tag
      if (prevScanned.length === 0) {
        Alert.alert("Initial Scan Complete", "Bulk payload synced. Review the list: if items are 'Waiting', stir the pile and hit SCAN RFID again to catch dropped signals.");
        return ["BED-849X", "BED-850Y", "GWN-112A"]; // Leaves GWN-113B missing initially
      }
      
      // Cumulative Idempotent Rescan Phase
      const currentlyMissing = MOCK_EXPECTED.filter(item => !prevScanned.includes(item.serial));
      
      if (currentlyMissing.length > 0) {
        // Appends the dropped tag safely without duplicates
        const newlyFoundItem = currentlyMissing[0].serial;
        const newSet = Array.from(new Set([...prevScanned, newlyFoundItem]));
        Alert.alert("Rescan Successful", `Picked up a dropped tag: ${newlyFoundItem}!\nCleanly appended to the active list without duplicates.`);
        return newSet;
      } else {
        Alert.alert("Pile Exhausted", "No new tags detected. The scanner is safely ignoring all duplicate reads.");
        return prevScanned;
      }
    });
  };

  const attemptFinishScanning = () => {
    Alert.alert(
      "Finish Scanning?",
      "Are you sure you have scanned all the clean laundry from the vendor? The system will now freeze the count and generate the Discrepancy Report.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Generate Report", onPress: () => setPhase('REPORT') }
      ]
    );
  };

  const confirmAllReturned = () => {
    Alert.alert("Return Logged", "Discrepancy report saved. Missing items flagged for NS Dashboard billing adjustment.", [
       { text: "Close Workflow", onPress: () => {
           setPhase('SCANNING');
           setScannedItems([]);
       }}
    ]);
  };

  if (phase === 'REPORT') {
     const safeScannedItems = Array.isArray(scannedItems) ? scannedItems : [];
     const missingItems = MOCK_EXPECTED.filter(item => !safeScannedItems.includes(item.serial));
     const receivedItems = MOCK_EXPECTED.filter(item => safeScannedItems.includes(item.serial));

     return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 100}}>
            <Text style={styles.title}>Reconciliation Report</Text>
            <Text style={styles.subtitle}>Clean Laundry vs Original Dispatch Logs</Text>

            <View style={styles.card}>
               <Text style={[styles.label, {color: theme.primary}]}>SUCCESSFULLY RECEIVED</Text>
               <Text style={{fontWeight: '900', fontSize: 24}}>{receivedItems.length} items</Text>
               <View style={{marginTop: 10}}>
                  {categories.map(cat => {
                     const count = receivedItems.filter(i => i.category === cat).length;
                     if (count === 0) return null;
                     return <Text key={cat} style={{color: theme.textMuted, fontWeight: '700'}}>• {cat}: {count}</Text>;
                  })}
               </View>
            </View>

            <View style={[styles.card, {borderColor: theme.danger, borderWidth: 2}]}>
               <Text style={[styles.label, {color: theme.danger}]}>MISSING ITEMS</Text>
               <Text style={{fontWeight: '900', fontSize: 24, color: theme.danger}}>{missingItems.length} items</Text>
               <Text style={{color: theme.textMuted, marginBottom: 15, fontSize: 12}}>*Billing/compensation deductions will strictly execute on the NS Web Dashboard. Ground Ops logs only.</Text>
               
               {missingItems.map(item => (
                  <View key={item.serial} style={{padding: 10, backgroundColor: '#fef2f2', borderRadius: 5, marginBottom: 5}}>
                     <Text style={{fontWeight: 'bold', color: theme.danger}}>{item.serial} - {item.category}</Text>
                     <Text style={{fontSize: 12, color: theme.textMuted}}>Sent in: {item.bag} | From: {item.ward} (Rm {item.room})</Text>
                  </View>
               ))}
            </View>
          </ScrollView>

          <View style={styles.fixedBottom}>
             <TouchableOpacity style={styles.finalBtn} onPress={confirmAllReturned}>
               <FontAwesome5 name="check-double" size={20} color="#fff" />
               <Text style={styles.finalBtnText}>CONFIRM RETURN LOG</Text>
             </TouchableOpacity>
          </View>
        </View>
     );
  }

  // Phase 1: SCANNING
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 100}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5}}>
           <Text style={styles.title}>Receive Clean Laundry</Text>
           <TouchableOpacity style={styles.rfidBtn} onPress={simulateRFIDScan}>
              <MaterialCommunityIcons name="barcode-scan" size={16} color="#fff" />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>SCAN RFID</Text>
           </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Scan physical clean linen to match against pending Vendor Dispatch records.</Text>

        {LINEN_TYPES.map((cat) => {
           const safeScannedItems = Array.isArray(scannedItems) ? scannedItems : [];
           const expectedInCat = MOCK_EXPECTED.filter(i => i.category === cat);
           
           // Only explicitly scanned items appear in the active list
           const itemsToDisplay = expectedInCat.filter(i => safeScannedItems.includes(i.serial));

           return (
             <View key={cat} style={styles.accordionContainer}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpandedCat(expandedCat === cat ? null : cat)}>
                   <View>
                      <Text style={styles.accordionTitle}>{cat}</Text>
                      <Text style={{fontSize: 12, color: theme.textMuted}}>Received: {itemsToDisplay.length} items</Text>
                   </View>
                   <MaterialCommunityIcons name={expandedCat === cat ? "chevron-up" : "chevron-down"} size={24} color={theme.primary} />
                </TouchableOpacity>

                {expandedCat === cat && (
                   <ScrollView horizontal={true} style={styles.tableScroll}>
                      <View style={styles.table}>
                         <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableCellHeader, {width: 100}]}>Serial</Text>
                            <Text style={[styles.tableCellHeader, {width: 80}]}>Status</Text>
                            <Text style={[styles.tableCellHeader, {width: 120}]}>Original Ward</Text>
                            <Text style={[styles.tableCellHeader, {width: 80}]}>Sent Bag</Text>
                         </View>
                         {itemsToDisplay.length === 0 ? (
                            <Text style={{textAlign: 'center', padding: 20, color: theme.textMuted}}>No received items scanned yet.</Text>
                         ) : (
                            itemsToDisplay.map(item => (
                               <View key={item.serial} style={styles.tableRow}>
                                  <Text style={[styles.tableCell, {width: 100, fontWeight: '700'}]}>{item.serial}</Text>
                                  <Text style={[styles.tableCell, {width: 80, color: theme.secondary, fontWeight: 'bold'}]}>
                                     Received
                                  </Text>
                                  <Text style={[styles.tableCell, {width: 120}]}>{item.ward} (Rm {item.room})</Text>
                                  <Text style={[styles.tableCell, {width: 80}]}>{item.bag}</Text>
                               </View>
                            ))
                         )}
                      </View>
                   </ScrollView>
                )}
             </View>
           );
        })}
      </ScrollView>

      <View style={styles.fixedBottom}>
         <TouchableOpacity style={styles.finishBtn} onPress={attemptFinishScanning}>
           <MaterialCommunityIcons name="clipboard-check" size={24} color="#fff" />
           <Text style={styles.finishBtnText}>FINISH SCANNING</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  title: { fontSize: 22, fontWeight: '900', color: theme.textMain, marginTop: 5 },
  subtitle: { fontSize: 13, color: theme.textMuted, marginBottom: 20 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  label: { fontSize: 16, fontWeight: '800', marginBottom: 5 },
  rfidBtn: { backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  
  accordionContainer: { marginBottom: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 8, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 15 },
  accordionTitle: { fontWeight: '800', fontSize: 16, color: theme.textMain },
  tableScroll: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: theme.border },
  table: { minWidth: 380 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
  tableCellHeader: { fontWeight: '700', fontSize: 13, color: theme.textMuted },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  tableCell: { fontSize: 13, color: theme.textMain },
  
  fixedBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: theme.border },
  finishBtn: { backgroundColor: theme.accent, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 10, gap: 10 },
  finishBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  finalBtn: { backgroundColor: theme.secondary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 10, gap: 10 },
  finalBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});
