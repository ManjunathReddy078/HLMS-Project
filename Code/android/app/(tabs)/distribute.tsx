import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, router } from 'expo-router';
import { theme } from '../../theme';

const LINEN_TYPES = [
  "Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", 
  "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", 
  "Aprons", "Curtains"
];

const WARDS = ['ICU', 'General Ward', 'Maternity', 'Emergency', 'Surgery', 'Pediatrics', 'Oncology'];

interface RequestedItem {
  item: string;
  qty: number;
}

interface SosRequest {
  id: string;
  ward: string;
  room: string;
  floor: string;
  empId: string;
  empName: string;
  timestamp: string;
  status: string;
  requestedItems: RequestedItem[];
}

type TabMode = 'ROUTINE' | 'EMERGENCY';

export default function DistributeScreen() {
  const [activeTab, setActiveTab] = useState<TabMode>('ROUTINE');

  // --- ROUTINE STATE ---
  const [selectedWard, setSelectedWard] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [scannerMode, setScannerMode] = useState<'ADD' | 'REMOVE'>('ADD');
  const [routineItems, setRoutineItems] = useState<{serial: string, category: string}[]>([]);

  // --- EMERGENCY STATE ---
  const [sosRequests, setSosRequests] = useState<SosRequest[]>([]);
  const [isLoadingSOS, setIsLoadingSOS] = useState(false);
  const [fulfillingSos, setFulfillingSos] = useState<SosRequest | null>(null);
  const [sosWard, setSosWard] = useState('');
  const [sosFloor, setSosFloor] = useState('');
  const [sosRoom, setSosRoom] = useState('');
  const [sosItems, setSosItems] = useState<{serial: string, category: string}[]>([]);

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localIp = debuggerHost?.split(':')[0] || '10.0.2.2';
  const API_URL = `http://${localIp}:5000`;

  // Fetch SOS requests automatically when switching to the EMERGENCY tab
  useEffect(() => {
    let interval: any;
    if (activeTab === 'EMERGENCY') {
      setIsLoadingSOS(true);
      fetchActiveRequests();
      interval = setInterval(fetchActiveRequests, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchActiveRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/sos_requests`);
      const data: SosRequest[] = await response.json();
      const activeData = data.filter(r => r.status === 'Active' || r.status === 'Pending');
      activeData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setSosRequests(activeData);
    } catch (e) {
      console.error('Failed to fetch SOS requests', e);
    }
    setIsLoadingSOS(false);
  };

  // Auto-Fulfill exact SOS if routed via Alarm Notification
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.tab === 'EMERGENCY') {
       setActiveTab('EMERGENCY');
       // Clear param so it doesn't get stuck in a loop
       router.setParams({ tab: '' });
    }
  }, [params.tab]);

  // --- ROUTINE LOGIC ---
  const handleRoutineScan = () => {
    if (scannerMode === 'ADD') {
       const categories = ["Bedsheet", "Patient Gown", "Towel", "Pillow Cover"];
       const randCat = categories[Math.floor(Math.random() * categories.length)];
       const count = Math.floor(Math.random() * 3) + 1; 
       
       const newItems = [];
       for(let i=0; i<count; i++) {
         newItems.push({ serial: `RFID_CLN_${Math.floor(Math.random() * 100000)}`, category: randCat });
       }
       setRoutineItems([...routineItems, ...newItems]);
       Alert.alert("Scan Successful", `Added ${count}x ${randCat} to drop-off queue.`);
    } else {
       if (routineItems.length > 0) {
          const removedItem = routineItems[routineItems.length - 1]; 
          setRoutineItems(routineItems.slice(0, -1));
          Alert.alert("Take-Back Successful", `Removed ${removedItem.category} from drop-off queue.`);
       } else {
          Alert.alert("Empty Queue", "There are no items currently assigned to this room to take back.");
       }
    }
  };

  const confirmRoutineDistribution = async () => {
    if (!selectedWard || !floorNo || !roomNo) {
      Alert.alert("Missing Location", "Please complete Ward, Floor, and Room number fields.");
      return;
    }
    if (routineItems.length === 0) {
      Alert.alert("Empty Delivery", "You must scan at least one item to distribute.");
      return;
    }

    try {
      const empId = await AsyncStorage.getItem('user_empId');
      const empName = await AsyncStorage.getItem('user_fullName');

      const distributionData = {
        ward: selectedWard,
        floor: floorNo,
        room: roomNo,
        empId: empId || "Unknown",
        empName: empName || "Unknown",
        timestamp: new Date().toISOString(),
        items: routineItems
      };

      const response = await fetch(`${API_URL}/distributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(distributionData)
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      Alert.alert(
        "Drop-off Confirmed", 
        `Successfully delivered ${routineItems.length} items to ${selectedWard} (Rm ${roomNo}).`,
        [{ text: "Next Room", onPress: () => { 
             setRoomNo(''); 
             setRoutineItems([]); 
             setScannerMode('ADD');
        }}]
      );
    } catch (e) {
      Alert.alert("Network Error", "Could not synchronize distribution data.");
    }
  };

  // --- EMERGENCY LOGIC ---
  const startFulfillingSos = (req: SosRequest) => {
    setSosWard(req.ward);
    setSosFloor(req.floor || '');
    setSosRoom(req.room);
    setSosItems([]);
    setFulfillingSos(req);
  };

  const handleSosScan = () => {
    if (!fulfillingSos) return;
    
    // Exactly map the requested items to perfect RFIDs
    const newItems: {serial: string, category: string}[] = [];
    fulfillingSos.requestedItems.forEach(reqItem => {
      for(let i=0; i<reqItem.qty; i++) {
        newItems.push({ 
           serial: `RFID_SOS_${Math.floor(Math.random() * 900000) + 100000}`, 
           category: reqItem.item 
        });
      }
    });
    
    // Overwrite the queue completely to enforce exact mathematical match
    setSosItems(newItems);
  };

  const handleSosRemoveItem = (serial: string) => {
    setSosItems(sosItems.filter(item => item.serial !== serial));
  };

  const confirmSosDistribution = async () => {
    if (sosItems.length === 0) {
      Alert.alert("Empty Delivery", "Scan items before confirming this SOS fulfillment.");
      return;
    }

    try {
      const empId = await AsyncStorage.getItem('user_empId');
      const empName = await AsyncStorage.getItem('user_fullName');

      // 1. Post to distributions
      await fetch(`${API_URL}/distributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ward: sosWard,
          floor: sosFloor,
          room: sosRoom,
          empId: empId || "Unknown",
          empName: empName || "Unknown",
          timestamp: new Date().toISOString(),
          items: sosItems,
          sosId: fulfillingSos?.id
        })
      });

      // 2. Patch SOS request
      await fetch(`${API_URL}/sos_requests/${fulfillingSos?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });

      Alert.alert("SOS Resolved", `Emergency fulfillment complete for ${sosWard} (Rm ${sosRoom}).`, [{ text: "Done", onPress: () => { 
        setFulfillingSos(null);
        fetchActiveRequests();
      }}]);
    } catch (e) {
      Alert.alert("Error", "Could not complete SOS fulfillment.");
    }
  };


  const routineCounts: any = {};
  routineItems.forEach(item => {
     routineCounts[item.category] = (routineCounts[item.category] || 0) + 1;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ward Distribution</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'ROUTINE' && styles.tabBtnActiveRoutine]} 
          onPress={() => setActiveTab('ROUTINE')}>
          <MaterialCommunityIcons name="clipboard-list" size={18} color={activeTab === 'ROUTINE' ? '#fff' : theme.textMuted} />
          <Text style={[styles.tabText, activeTab === 'ROUTINE' && {color: '#fff'}]}>Routine Drop-off</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'EMERGENCY' && styles.tabBtnActiveEmergency]} 
          onPress={() => {
            setActiveTab('EMERGENCY');
            setFulfillingSos(null);
          }}>
          <MaterialCommunityIcons name="alert-decagram" size={18} color={activeTab === 'EMERGENCY' ? '#fff' : theme.textMuted} />
          <Text style={[styles.tabText, activeTab === 'EMERGENCY' && {color: '#fff'}]}>Emergency SOS</Text>
        </TouchableOpacity>
      </View>
      
      {/* ROUTINE MODE */}
      {activeTab === 'ROUTINE' && (
        <View>
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

          <View style={[styles.card, scannerMode === 'REMOVE' && {borderColor: theme.danger, borderWidth: 2}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
               <Text style={[styles.label, scannerMode === 'REMOVE' && {color: theme.danger}]}>
                 2. Scanner Mode: {scannerMode}
               </Text>
               <TouchableOpacity 
                  style={[styles.rfidBtn, scannerMode === 'REMOVE' && {backgroundColor: theme.danger}]} 
                  onPress={handleRoutineScan}>
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
                <Text style={[styles.toggleText, scannerMode === 'REMOVE' && {color: '#fff'}]}>TAKE BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>3. Active Drop-off Queue</Text>
            <Text style={{fontSize: 13, color: theme.textMuted, marginBottom: 15}}>Items officially mapped to this room.</Text>

            {LINEN_TYPES.map(item => {
               const qty = routineCounts[item] || 0;
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
              TOTAL CLEAN DELIVERED: {routineItems.length}
            </Text>

            <TouchableOpacity style={styles.submitBtn} onPress={confirmRoutineDistribution}>
              <FontAwesome5 name="check-circle" size={20} color="#fff" />
              <Text style={styles.submitText}>Confirm Ward Drop-off</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* EMERGENCY MODE */}
      {activeTab === 'EMERGENCY' && (
        <View>
          {fulfillingSos ? (
            // SOS FULFILLMENT UI (Detailed Scanning)
            <View>
               <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15}} onPress={() => setFulfillingSos(null)}>
                 <Feather name="arrow-left" size={18} color={theme.textMuted} />
                 <Text style={{color: theme.textMuted, fontWeight: 'bold'}}>Back to Requests</Text>
               </TouchableOpacity>

               <View style={styles.card}>
                 <Text style={styles.label}>1. Emergency Location (Editable)</Text>
                 <View style={{flexDirection: 'row', gap: 15, marginTop: 15}}>
                   <View style={{flex: 1}}>
                      <Text style={styles.subLabel}>Ward</Text>
                      <TextInput style={styles.inputSmall} value={sosWard} onChangeText={setSosWard} />
                   </View>
                   <View style={{flex: 1}}>
                      <Text style={styles.subLabel}>Floor No</Text>
                      <TextInput style={styles.inputSmall} keyboardType="numeric" value={sosFloor} onChangeText={setSosFloor} />
                   </View>
                   <View style={{flex: 1}}>
                      <Text style={styles.subLabel}>Room No</Text>
                      <TextInput style={styles.inputSmall} value={sosRoom} onChangeText={setSosRoom} />
                   </View>
                 </View>
               </View>

               <View style={styles.card}>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                    <Text style={styles.label}>2. Scan Emergency Linens</Text>
                    <TouchableOpacity style={styles.rfidBtn} onPress={handleSosScan}>
                       <MaterialCommunityIcons name="barcode-scan" size={16} color="#fff" />
                       <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>SCAN RFID</Text>
                    </TouchableOpacity>
                 </View>

                 {sosItems.length > 0 ? (
                   <View style={styles.scannedListContainer}>
                     {sosItems.map(item => (
                       <View key={item.serial} style={styles.scannedItemRow}>
                         <View>
                           <Text style={{fontWeight: 'bold', color: theme.textMain}}>{item.serial}</Text>
                           <Text style={{fontSize: 12, color: theme.textMuted}}>{item.category}</Text>
                         </View>
                         <TouchableOpacity onPress={() => handleSosRemoveItem(item.serial)} style={{padding: 8}}>
                           <Feather name="trash-2" size={18} color={theme.danger} />
                         </TouchableOpacity>
                       </View>
                     ))}
                   </View>
                 ) : (
                   <Text style={{color: theme.textMuted, textAlign: 'center', padding: 20}}>No items scanned for this emergency yet.</Text>
                 )}
               </View>

               <TouchableOpacity style={styles.resolveBtn} onPress={confirmSosDistribution}>
                 <FontAwesome5 name="check-double" size={20} color="#fff" />
                 <Text style={styles.resolveText}>CONFIRM & RESOLVE SOS</Text>
               </TouchableOpacity>
            </View>
          ) : (
            // SOS REQUESTS LIST
            <View>
              {isLoadingSOS ? (
                <View style={[styles.card, { alignItems: 'center', padding: 40 }]}>
                  <ActivityIndicator size="large" color={theme.danger} />
                  <Text style={{ marginTop: 15, color: theme.textMuted, fontWeight: 'bold' }}>Scanning for emergencies...</Text>
                </View>
              ) : sosRequests.length === 0 ? (
                <View style={[styles.card, { alignItems: 'center', padding: 40, borderColor: (theme as any).success || '#10b981', borderWidth: 2 }]}>
                  <Feather name="check-circle" size={48} color={(theme as any).success || '#10b981'} />
                  <Text style={{ marginTop: 15, color: theme.textMain, fontWeight: 'bold', fontSize: 16 }}>No Active Emergencies</Text>
                  <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 5 }}>All ward requests have been fulfilled.</Text>
                </View>
              ) : (
                sosRequests.map((req: SosRequest, idx: number) => (
                  <View key={req.id || idx.toString()} style={styles.requestBox}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.reqWard}>{req.ward} - Room {req.room}</Text>
                      <Text style={styles.reqTime}>
                        {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <Text style={styles.reqUser}>Requested by: {req.empName} ({req.empId})</Text>
                    
                    <View style={styles.itemsList}>
                      {req.requestedItems.map((item: RequestedItem, i: number) => (
                        <Text key={i.toString()} style={styles.itemRow}>• {item.qty}x {item.item}</Text>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.resolveBtn} onPress={() => startFulfillingSos(req)}>
                      <MaterialCommunityIcons name="clipboard-arrow-right" size={20} color="#fff" />
                      <Text style={styles.resolveText}>FULFILL REQUEST</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      )}

      <View style={{height: 60}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginBottom: 15, marginTop: 5 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: theme.card, borderRadius: 12, padding: 5, marginBottom: 20, elevation: 2 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8 },
  tabBtnActiveRoutine: { backgroundColor: theme.secondary },
  tabBtnActiveEmergency: { backgroundColor: theme.danger },
  tabText: { fontWeight: 'bold', fontSize: 14, color: theme.textMuted },

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
  submitText: { color: '#fff', fontWeight: '900', fontSize: 18 },

  requestBox: { borderWidth: 2, borderColor: theme.danger, borderRadius: 12, padding: 15, marginBottom: 15, backgroundColor: '#fef2f2' },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  reqWard: { fontSize: 18, fontWeight: '900', color: theme.danger },
  reqTime: { fontSize: 14, fontWeight: 'bold', color: theme.textMuted },
  reqUser: { fontSize: 14, color: theme.textMuted, marginBottom: 10 },
  itemsList: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15 },
  itemRow: { fontSize: 15, fontWeight: 'bold', color: theme.textMain, marginBottom: 4 },
  resolveBtn: { backgroundColor: theme.primary, padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  resolveText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  
  scannedListContainer: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 10, backgroundColor: '#f8fafc' },
  scannedItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border }
});
