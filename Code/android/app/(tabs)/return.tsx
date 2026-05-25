import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { theme } from '../../theme';

interface ExpectedItem {
  serial: string;
  category: string;
  ward: string;
  room: string;
  bag: string;
  dispatchWeight: string;
}

export default function ReturnScreen() {
  const [phase, setPhase] = useState<'SELECT_VENDOR' | 'SCANNING' | 'REPORT'>('SELECT_VENDOR');
  const [activeVendor, setActiveVendor] = useState<string | null>(null);
  
  const [vendorInventories, setVendorInventories] = useState<Record<string, ExpectedItem[]>>({});
  const [completedReturns, setCompletedReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [scannedSerials, setScannedSerials] = useState<string[]>([]);
  const [damagedSerials, setDamagedSerials] = useState<string[]>([]);
  const [receivedWeight, setReceivedWeight] = useState('');

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localIp = debuggerHost?.split(':')[0] || '10.0.2.2';
  const API_URL = `http://${localIp}:5000`;

  useEffect(() => {
    if (phase === 'SELECT_VENDOR') {
       fetchVendorDebt();
    }
  }, [phase]);

  const fetchVendorDebt = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Dispatches
      const dispRes = await fetch(`${API_URL}/dispatches`);
      const dispatches = await dispRes.json();

      // 2. Fetch Collections
      const colRes = await fetch(`${API_URL}/collections`);
      const collections = await colRes.json();

      // 3. Fetch Returns
      const retRes = await fetch(`${API_URL}/returns`);
      let returns = [];
      if (retRes.ok) {
         returns = await retRes.json();
      }
      // Sort history latest first
      returns.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setCompletedReturns(returns);
      
      const returnedBagIds = returns.flatMap((r: any) => r.returnedBags || []);

      const inventory: Record<string, ExpectedItem[]> = {};

      dispatches.forEach((dispatch: any) => {
         // Skip if this bag has already been returned
         if (returnedBagIds.includes(dispatch.bagId)) return;

         const v = dispatch.vendor || "Unknown Vendor";
         if (!inventory[v]) inventory[v] = [];

         const collection = collections.find((c: any) => c.bagId === dispatch.bagId);
         if (collection && collection.items) {
             collection.items.forEach((item: any) => {
                inventory[v].push({
                   serial: item.serial,
                   category: item.category,
                   ward: collection.ward || "Unknown",
                   room: collection.room || "Unknown",
                   bag: dispatch.bagId,
                   dispatchWeight: dispatch.weight
                });
             });
         }
      });

      setVendorInventories(inventory);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not fetch active vendor inventories.");
    }
    setIsLoading(false);
  };

  const startReceiving = (vendor: string) => {
    setActiveVendor(vendor);
    setScannedSerials([]);
    setDamagedSerials([]);
    setReceivedWeight('');
    setPhase('SCANNING');
  };

  const simulateRFIDScan = () => {
    if (!activeVendor || !vendorInventories[activeVendor]) return;
    
    setScannedSerials(prev => {
      if (prev.length === 0) {
        // Simulate missing 1 item randomly
        const expected = vendorInventories[activeVendor];
        if (expected.length > 1) {
            const scanned = expected.slice(0, -1).map(i => i.serial);
            Alert.alert("Scan Complete", `Scanned ${scanned.length} items. Looks like 1 item is missing from the pile.`);
            return scanned;
        } else {
            return expected.map(i => i.serial);
        }
      } else {
        // Rescan catches the missing one
        const expected = vendorInventories[activeVendor];
        Alert.alert("Rescan Successful", "Picked up the dropped tag!");
        return expected.map(i => i.serial);
      }
    });
  };

  const toggleDamaged = (serial: string) => {
    if (damagedSerials.includes(serial)) {
      setDamagedSerials(damagedSerials.filter(s => s !== serial));
    } else {
      setDamagedSerials([...damagedSerials, serial]);
    }
  };

  const attemptFinishScanning = () => {
    if (!receivedWeight) {
      Alert.alert("Missing Weight", "Please enter the total received weight for this bulk return before finalizing the report.");
      return;
    }
    Alert.alert(
      "Generate Final Challan",
      "Are you sure you want to freeze this scan and generate the final reconciliation report?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Generate Challan", onPress: () => setPhase('REPORT') }
      ]
    );
  };

  const confirmAllReturned = async () => {
    if (!activeVendor) return;
    try {
      const empId = await AsyncStorage.getItem('user_empId');
      const empName = await AsyncStorage.getItem('user_fullName');

      const expected = vendorInventories[activeVendor] || [];
      const returnedItems = expected.filter(i => scannedSerials.includes(i.serial));
      const missingItems = expected.filter(i => !scannedSerials.includes(i.serial));
      const damagedItemsList = expected.filter(i => damagedSerials.includes(i.serial));
      
      const returnedBags = Array.from(new Set(expected.map(i => i.bag)));

      const payload = {
         vendor: activeVendor,
         empId: empId || "Unknown",
         empName: empName || "Unknown",
         timestamp: new Date().toISOString(),
         receivedWeight,
         returnedBags,
         stats: {
           expectedCount: expected.length,
           receivedCount: returnedItems.length,
           missingCount: missingItems.length,
           damagedCount: damagedItemsList.length
         },
         missingItems: missingItems.map(i => i.serial),
         damagedItems: damagedItemsList.map(i => i.serial)
      };

      await fetch(`${API_URL}/returns`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });

      Alert.alert("Return Logged", "Final Challan submitted to database. Global inventory updated.", [
         { text: "Close Workflow", onPress: () => {
             setPhase('SELECT_VENDOR');
             setActiveVendor(null);
         }}
      ]);
    } catch (e) {
      Alert.alert("Network Error", "Could not submit final return challan.");
    }
  };


  if (isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
         <ActivityIndicator size="large" color={theme.primary} />
         <Text style={{marginTop: 15, color: theme.textMuted}}>Cross-referencing databases...</Text>
      </View>
    );
  }

  if (phase === 'SELECT_VENDOR') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
         <Text style={styles.title}>Pending Vendor Returns</Text>
         <Text style={styles.subtitle}>Select a vendor to reconcile their outstanding linen inventory.</Text>
         
         {Object.keys(vendorInventories).length === 0 ? (
            <View style={[styles.card, {alignItems: 'center', padding: 40, borderColor: theme.success || '#10b981', borderWidth: 2}]}>
               <Feather name="check-circle" size={48} color={theme.success || '#10b981'} />
               <Text style={{marginTop: 15, fontWeight: 'bold', fontSize: 16}}>No Outstanding Debt</Text>
               <Text style={{color: theme.textMuted, textAlign: 'center'}}>All vendors have fully returned their dispatched laundry.</Text>
            </View>
         ) : (
            Object.keys(vendorInventories).map((vendor, vIdx) => {
               const items = vendorInventories[vendor];
               const uniqueBags = Array.from(new Set(items.map(i => i.bag)));
               
               return (
                 <View key={`vendor-${vendor}-${vIdx}`} style={styles.card}>
                   <Text style={{fontSize: 20, fontWeight: '900', color: theme.primary}}>{vendor}</Text>
                   <Text style={{color: theme.textMuted, marginBottom: 15}}>Outstanding Debt: {uniqueBags.length} Bags ({items.length} total items)</Text>
                   
                   <View style={{backgroundColor: '#f1f5f9', padding: 10, borderRadius: 8, marginBottom: 15}}>
                      <Text style={{fontWeight: 'bold', fontSize: 13, marginBottom: 5}}>Pending Bags:</Text>
                      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
                         {uniqueBags.map((b, idx) => (
                            <View key={`bag-${b || 'empty'}-${idx}`} style={{backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4}}>
                               <Text style={{fontSize: 11, fontWeight: 'bold', color: theme.textMain}}>{b}</Text>
                            </View>
                         ))}
                      </View>
                   </View>

                   <TouchableOpacity style={styles.startBtn} onPress={() => startReceiving(vendor)}>
                      <FontAwesome5 name="truck-loading" size={16} color="#fff" />
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>START RECEIVING ({vendor})</Text>
                   </TouchableOpacity>
                 </View>
               );
            })
         )}

         {/* Historical Returns Section */}
         {completedReturns.length > 0 && (
            <View style={{marginTop: 30}}>
               <Text style={[styles.title, {fontSize: 18}]}>Recently Completed Challans</Text>
               <Text style={styles.subtitle}>Track history of successful reconciliations.</Text>
               
               {completedReturns.map((ret, idx) => {
                  const dateStr = new Date(ret.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                  return (
                    <View key={`ret-${idx}`} style={[styles.card, {borderColor: theme.success || '#10b981', borderWidth: 1, padding: 15}]}>
                       <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text style={{fontWeight: '900', fontSize: 16, color: theme.primary}}>CHL-{new Date(ret.timestamp).getTime().toString().slice(-6)}</Text>
                          <View style={{backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10}}>
                             <Text style={{color: theme.success || '#10b981', fontWeight: 'bold', fontSize: 10}}>ACCEPTED</Text>
                          </View>
                       </View>
                       <Text style={{color: theme.textMuted, fontSize: 13, marginVertical: 8}}>{ret.vendor} • {dateStr} • {ret.receivedWeight}kg</Text>
                       <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 8, borderRadius: 5}}>
                          <Text style={{color: theme.success || '#10b981', fontWeight: 'bold', fontSize: 12}}>✔ Clean: {ret.stats.receivedCount}</Text>
                          <Text style={{color: theme.warning || '#f59e0b', fontWeight: 'bold', fontSize: 12}}>⚠️ Damaged: {ret.stats.damagedCount}</Text>
                          <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12}}>❌ Miss: {ret.stats.missingCount}</Text>
                       </View>
                    </View>
                  );
               })}
            </View>
         )}
      </ScrollView>
    );
  }

  if (phase === 'REPORT') {
     const expected = vendorInventories[activeVendor!] || [];
     const missingItems = expected.filter(item => !scannedSerials.includes(item.serial));
     const receivedItems = expected.filter(item => scannedSerials.includes(item.serial));
     const damagedItemsList = expected.filter(item => damagedSerials.includes(item.serial));

     return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <TouchableOpacity onPress={() => setPhase('SCANNING')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15}}>
               <Feather name="arrow-left" size={18} color={theme.textMuted} />
               <Text style={{color: theme.textMuted, fontWeight: 'bold'}}>Back to Scanning</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Final Return Challan</Text>
            <Text style={styles.subtitle}>{activeVendor} • Received Weight: {receivedWeight}kg</Text>

            <View style={styles.card}>
               <Text style={[styles.label, {color: theme.primary}]}>SUCCESSFULLY RECEIVED</Text>
               <Text style={{fontWeight: '900', fontSize: 24}}>{receivedItems.length} items</Text>
               {damagedItemsList.length > 0 && (
                  <Text style={{color: theme.warning || '#f59e0b', fontWeight: 'bold', marginTop: 5}}>⚠️ Includes {damagedItemsList.length} damaged items</Text>
               )}
            </View>

            {missingItems.length > 0 && (
               <View style={[styles.card, {borderColor: theme.danger, borderWidth: 2}]}>
                  <Text style={[styles.label, {color: theme.danger}]}>MISSING ITEMS DISCREPANCY</Text>
                  <Text style={{fontWeight: '900', fontSize: 24, color: theme.danger}}>{missingItems.length} items</Text>
                  <Text style={{color: theme.textMuted, marginBottom: 15, fontSize: 12}}>*Billing deductions will execute on the Web Dashboard based on this table.</Text>
                  
                  <ScrollView horizontal>
                    <View style={{minWidth: 400}}>
                       <View style={{flexDirection: 'row', backgroundColor: '#fef2f2', padding: 8, borderBottomWidth: 1, borderColor: '#fca5a5'}}>
                          <Text style={{width: 100, fontWeight: 'bold', color: theme.danger, fontSize: 12}}>Serial</Text>
                          <Text style={{width: 100, fontWeight: 'bold', color: theme.danger, fontSize: 12}}>Category</Text>
                          <Text style={{width: 80, fontWeight: 'bold', color: theme.danger, fontSize: 12}}>Sent Bag</Text>
                          <Text style={{width: 120, fontWeight: 'bold', color: theme.danger, fontSize: 12}}>Original Ward</Text>
                       </View>
                       {missingItems.map((item, idx) => (
                          <View key={`missing-${item.serial}-${idx}`} style={{flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#fee2e2'}}>
                             <Text style={{width: 100, fontWeight: 'bold', color: theme.danger, fontSize: 12}}>{item.serial}</Text>
                             <Text style={{width: 100, color: theme.danger, fontSize: 12}}>{item.category}</Text>
                             <Text style={{width: 80, color: theme.danger, fontSize: 12}}>{item.bag}</Text>
                             <Text style={{width: 120, color: theme.danger, fontSize: 12}}>{item.ward}</Text>
                          </View>
                       ))}
                    </View>
                  </ScrollView>
               </View>
            )}
          </ScrollView>

          <View style={styles.fixedBottom}>
             <TouchableOpacity style={styles.finalBtn} onPress={confirmAllReturned}>
               <FontAwesome5 name="check-double" size={20} color="#fff" />
               <Text style={styles.finalBtnText}>SUBMIT FINAL CHALLAN</Text>
             </TouchableOpacity>
          </View>
        </View>
     );
  }

  // Phase: SCANNING
  const expected = vendorInventories[activeVendor!] || [];
  const scannedObj = expected.filter(i => scannedSerials.includes(i.serial));
  const missingObj = expected.filter(i => !scannedSerials.includes(i.serial));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 120}}>
        <TouchableOpacity onPress={() => setPhase('SELECT_VENDOR')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15}}>
           <Feather name="arrow-left" size={18} color={theme.textMuted} />
           <Text style={{color: theme.textMuted, fontWeight: 'bold'}}>Back to Vendors</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5}}>
           <Text style={styles.title}>Receive from {activeVendor}</Text>
           <TouchableOpacity style={styles.rfidBtn} onPress={simulateRFIDScan}>
              <MaterialCommunityIcons name="barcode-scan" size={16} color="#fff" />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>SCAN RFID</Text>
           </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Scan incoming physical linen to cross-check against {activeVendor}'s debt ({expected.length} expected items).</Text>

        <View style={[styles.card, {padding: 15}]}>
           <Text style={styles.label}>Incoming Weight</Text>
           <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <TextInput 
                 style={styles.inputLarge} 
                 placeholder="e.g. 45" 
                 keyboardType="numeric" 
                 value={receivedWeight} 
                 onChangeText={setReceivedWeight} 
              />
              <Text style={{fontWeight: 'bold', fontSize: 18, color: theme.textMuted}}>kg</Text>
           </View>
        </View>

        <View style={[styles.card, {padding: 0, overflow: 'hidden'}]}>
           <View style={{padding: 15, paddingBottom: 5}}>
              <Text style={styles.label}>Reconciliation Tracker</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10}}>
                 <Text style={{fontWeight: 'bold', color: theme.success || '#10b981'}}>Scanned: {scannedObj.length}</Text>
                 <Text style={{fontWeight: 'bold', color: theme.danger}}>Missing: {missingObj.length}</Text>
              </View>
           </View>

           <ScrollView horizontal>
             <View style={{minWidth: 480}}>
               <View style={{flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 10, borderBottomWidth: 1, borderColor: theme.border}}>
                 <Text style={{width: 100, fontWeight: 'bold', color: theme.textMuted, fontSize: 12}}>Serial</Text>
                 <Text style={{width: 100, fontWeight: 'bold', color: theme.textMuted, fontSize: 12}}>Category</Text>
                 <Text style={{width: 70, fontWeight: 'bold', color: theme.textMuted, fontSize: 12}}>Bag</Text>
                 <Text style={{width: 110, fontWeight: 'bold', color: theme.textMuted, fontSize: 12}}>Original</Text>
                 <Text style={{width: 100, fontWeight: 'bold', color: theme.textMuted, fontSize: 12, textAlign: 'center'}}>Action</Text>
               </View>
               {expected.map((item, idx) => {
                  const isScanned = scannedSerials.includes(item.serial);
                  const isDamaged = damagedSerials.includes(item.serial);
                  return (
                    <View key={`${item.serial}-${idx}`} style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#f8fafc', alignItems: 'center'}}>
                      <Text style={{width: 100, fontWeight: 'bold', color: isScanned ? theme.textMain : theme.textMuted, fontSize: 12}}>{item.serial}</Text>
                      <Text style={{width: 100, color: theme.textMain, fontSize: 12}}>{item.category}</Text>
                      <Text style={{width: 70, color: theme.textMuted, fontSize: 12}}>{item.bag}</Text>
                      <Text style={{width: 110, color: theme.textMuted, fontSize: 12}}>{item.ward}</Text>
                      <View style={{width: 100, alignItems: 'center'}}>
                         {isScanned ? (
                           <TouchableOpacity 
                              onPress={() => toggleDamaged(item.serial)}
                              style={{backgroundColor: isDamaged ? '#fef2f2' : '#f0fdf4', borderWidth: 1, borderColor: isDamaged ? theme.danger : (theme.success || '#10b981'), paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10}}>
                              <Text style={{color: isDamaged ? theme.danger : (theme.success || '#10b981'), fontSize: 10, fontWeight: 'bold'}}>{isDamaged ? 'DAMAGED' : 'CLEAN'}</Text>
                           </TouchableOpacity>
                         ) : (
                           <Text style={{color: theme.textMuted, fontSize: 10, fontWeight: 'bold'}}>PENDING</Text>
                         )}
                      </View>
                    </View>
                  );
               })}
             </View>
           </ScrollView>
        </View>

      </ScrollView>

      <View style={styles.fixedBottom}>
         <TouchableOpacity style={styles.finishBtn} onPress={attemptFinishScanning}>
           <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#fff" />
           <Text style={styles.finishBtnText}>GENERATE CHALLAN</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginTop: 5 },
  subtitle: { fontSize: 13, color: theme.textMuted, marginBottom: 20 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  label: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  startBtn: { backgroundColor: theme.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15, borderRadius: 10 },
  rfidBtn: { backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  inputLarge: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 20, fontWeight: 'bold', width: 100, backgroundColor: '#f8fafc', textAlign: 'center' },
  
  fixedBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: theme.border },
  finishBtn: { backgroundColor: theme.accent, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 10, gap: 10 },
  finishBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  finalBtn: { backgroundColor: theme.secondary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 10, gap: 10 },
  finalBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});
