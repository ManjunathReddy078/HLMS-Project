import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../theme';

export default function LoginScreen() {
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (workerId.length > 2 && password.length >= 4) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Access Denied', 'Please enter your assigned Employee ID and Password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Injecting the physical University Logo here */}
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: 144, height: 144, resizeMode: 'contain', marginBottom: 10 }}
        />
        <Text style={styles.title}>Worker Access</Text>
        <Text style={styles.subtitle}>HLM (Hospital Laundry Management)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          placeholder="EMP-8042"
          value={workerId}
          onChangeText={setWorkerId}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN SAFELY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 26, fontWeight: 'bold', color: theme.textMain, marginTop: 5 },
  subtitle: { fontSize: 16, fontWeight: '500', color: theme.textMuted, marginTop: 5 },
  card: { backgroundColor: theme.card, padding: 25, borderRadius: theme.radius, elevation: theme.elevation },
  label: { fontSize: 16, fontWeight: '700', color: theme.textMuted, marginBottom: 8 },
  input: { backgroundColor: '#f1f5f9', borderWidth: 2, borderColor: theme.border, borderRadius: 10, padding: 18, fontSize: 18, marginBottom: 20 },
  loginBtn: { backgroundColor: theme.primary, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }
});
