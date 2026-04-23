import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../theme';

interface CartItem {
  id: string;
  weight: string;
  type: string;
}

export default function DispatchScreen() {
  const [vendor, setVendor] = useState('Vendor A');
  const [bagId, setBagId] = useState('');
  const [weight, setWeight] = useState('');
  const [bagType, setBagType] = useState<'Yellow' | 'Blue'>('Yellow');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = () => {
    if (!bagId || !weight) {
      Alert.alert("Missing Data", "Please enter both the Bag ID and the Weight.");
      return;
    }
    const exists = cart.find(item => item.id === bagId);
    if (exists) {
      Alert.alert("Duplicate", "This Bag ID has already been added to the dispatch cart.");
      return;
    }
    setCart([...cart, { id: bagId, weight, type: bagType }]);
    setBagId('');
    setWeight('');
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotalWeight = () => {
    return cart.reduce((total, item) => total + parseFloat(item.weight || '0'), 0).toFixed(2);
  };

  const generateChallan = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Add at least one bag before generating a challan.");
      return;
    }
    
    Alert.alert(
      "Digital Challan Generated",
      `Dispatched ${cart.length} bags (${calculateTotalWeight()} kg) to ${vendor}.\n\nDatabase relation generated successfully mapping physical bags to RFID internal items.`,
      [{ text: "Complete Handover", onPress: () => {
          setCart([]);
          setVendor('Vendor A');
      }}]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vendor Dispatch Hub</Text>
      <Text style={styles.subtitle}>Link physical bags to digital RFID payloads.</Text>

      {/* 1. Vendor Selection */}
      <View style={styles.card}>
        <Text style={styles.label}>1. Assign Vendor Target</Text>
        <Text style={{fontSize: 13, color: theme.textMuted, marginBottom: 10}}>*Vendor is strictly locked while items are in the cart.</Text>
        <View style={styles.vendorRow}>
          {['Vendor A', 'Vendor B'].map(v => (
            <TouchableOpacity 
               key={v} 
               style={[
                 styles.vendorBtn, 
                 vendor === v && styles.vendorBtnActive,
                 cart.length > 0 && vendor !== v && { opacity: 0.4 }
               ]} 
               onPress={() => {
                 if (cart.length > 0 && vendor !== v) {
                   Alert.alert("Vendor Locked", `You cannot switch to ${v} while scanning bags for ${vendor}. Please generate the current challan first.`);
                 } else {
                   setVendor(v);
                 }
               }}>
              <Text style={vendor === v ? styles.vTextActive : styles.vText}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. Manual Bag Entry */}
      <View style={styles.card}>
        <Text style={styles.label}>2. Weighing & Bag Entry</Text>
        
        <View style={{flexDirection: 'row', gap: 15, marginBottom: 15}}>
          <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Bag ID Number</Text>
             <TextInput 
                style={styles.inputSmall} 
                placeholder="e.g. BAG-42" 
                autoCapitalize="characters"
                value={bagId} 
                onChangeText={setBagId} 
             />
          </View>
          <View style={{flex: 1}}>
             <Text style={styles.subLabel}>Measured Weight (kg)</Text>
             <TextInput 
                style={styles.inputSmall} 
                placeholder="0.0" 
                keyboardType="numeric"
                value={weight} 
                onChangeText={setWeight} 
             />
          </View>
        </View>

        <Text style={styles.subLabel}>Bag Infection Protocol</Text>
        <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
          <TouchableOpacity 
             style={[styles.bagToggleBtn, bagType === 'Yellow' && {backgroundColor: '#facc15', borderColor: '#ca8a04'}]} 
             onPress={() => setBagType('Yellow')}>
            <Text style={[styles.toggleText, bagType === 'Yellow' && {color: '#fff'}]}>YELLOW (Infected)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={[styles.bagToggleBtn, bagType === 'Blue' && {backgroundColor: theme.primary, borderColor: theme.primary}]} 
             onPress={() => setBagType('Blue')}>
            <Text style={[styles.toggleText, bagType === 'Blue' && {color: '#fff'}]}>BLUE (General)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addToCart}>
          <FontAwesome5 name="plus-circle" size={16} color="#fff" />
          <Text style={styles.addBtnText}>ADD TO DISPATCH CART</Text>
        </TouchableOpacity>
      </View>

      {/* 3. The Dispatch Cart Table */}
      <View style={styles.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
           <Text style={styles.label}>3. Dispatch Cart</Text>
           <Text style={{fontWeight: '900', color: theme.textMain}}>{cart.length} Bags</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, {flex: 2}]}>Bag ID</Text>
            <Text style={[styles.tableCellHeader, {flex: 2}]}>Type</Text>
            <Text style={[styles.tableCellHeader, {flex: 1}]}>Weight</Text>
            <Text style={[styles.tableCellHeader, {flex: 1, textAlign: 'right'}]}>Act</Text>
          </View>
          
          {cart.length === 0 ? (
             <Text style={{textAlign: 'center', color: theme.textMuted, padding: 20}}>Cart is empty. Add a bag above.</Text>
          ) : (
             cart.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, {flex: 2, fontWeight: '700'}]}>{item.id}</Text>
                  <Text style={[styles.tableCell, {flex: 2, color: item.type === 'Yellow' ? '#ca8a04' : theme.primary}]}>{item.type}</Text>
                  <Text style={[styles.tableCell, {flex: 1}]}>{item.weight}kg</Text>
                  <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={() => removeItem(item.id)}>
                    <MaterialCommunityIcons name="delete" size={20} color={theme.danger} />
                  </TouchableOpacity>
                </View>
             ))
          )}
          
          <View style={styles.totalRow}>
             <Text style={{fontWeight: '800', color: theme.textMain}}>TOTAL PAYLOAD:</Text>
             <Text style={{fontWeight: '900', fontSize: 18, color: theme.primary}}>{calculateTotalWeight()} kg</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.finalSubmitBtn} onPress={generateChallan}>
        <MaterialCommunityIcons name="truck-delivery" size={24} color="#fff" />
        <Text style={styles.finalSubmitText}>GENERATE DIGITAL CHALLAN</Text>
      </TouchableOpacity>
      
      <View style={{height: 60}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 15 },
  title: { fontSize: 24, fontWeight: '900', color: theme.textMain, marginTop: 5 },
  subtitle: { fontSize: 14, color: theme.textMuted, marginBottom: 20 },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 20, marginBottom: 15, elevation: theme.elevation },
  label: { fontSize: 18, fontWeight: '800', color: theme.textMain, marginBottom: 15 },
  subLabel: { fontSize: 13, fontWeight: '700', color: theme.textMuted, marginBottom: 5 },
  vendorRow: { flexDirection: 'row', gap: 15 },
  vendorBtn: { flex: 1, padding: 15, borderWidth: 2, borderColor: theme.border, borderRadius: 8, alignItems: 'center' },
  vendorBtnActive: { backgroundColor: '#f0f9ff', borderColor: theme.primary },
  vText: { color: theme.textMuted, fontWeight: '700' },
  vTextActive: { color: theme.primary, fontWeight: '900' },
  inputSmall: { borderWidth: 2, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc', fontWeight: 'bold' },
  bagToggleBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  toggleText: { color: theme.textMuted, fontWeight: '800', fontSize: 12 },
  addBtn: { backgroundColor: theme.textMain, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8, gap: 10 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  table: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  tableCellHeader: { fontWeight: '700', fontSize: 13, color: theme.textMuted },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  tableCell: { fontSize: 14, color: theme.textMain },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f8fafc' },
  finalSubmitBtn: { backgroundColor: theme.accent, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 10, marginBottom: 20, gap: 10 },
  finalSubmitText: { color: '#fff', fontWeight: '900', fontSize: 16 }
});
