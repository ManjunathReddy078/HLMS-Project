import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../theme';

// GLOBAL VARIABLE: This persists as long as the app is alive in memory.
// It guarantees the fingerprint prompt ONLY appears when the app is first opened!
let hasCheckedBiometricsThisSession = false;

export default function LoginScreen() {
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [showBiometricRetry, setShowBiometricRetry] = useState(false);

  useEffect(() => {
    checkSavedSession();
  }, []);

  const checkSavedSession = async () => {
    try {
      const savedEmpId = await AsyncStorage.getItem('user_empId');
      const lastLogin = await AsyncStorage.getItem('last_login');

      if (savedEmpId && lastLogin) {
        const now = Date.now();
        const timePassed = now - parseInt(lastLogin, 10);
        const threeHours = 3 * 60 * 60 * 1000; // Changed to 3 hours as requested

        if (timePassed > threeHours) {
          // Session expired
          await AsyncStorage.removeItem('user_empId');
          await AsyncStorage.removeItem('last_login');
        } else {
          // Session valid! Pre-fill the Emp ID and lock it
          setWorkerId(savedEmpId);
          setIsSessionLocked(true);

          // ONLY trigger fingerprint if we haven't done it this session!
          if (!hasCheckedBiometricsThisSession) {
            hasCheckedBiometricsThisSession = true; // Mark as checked so it never loops again on logout
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
              triggerBiometrics();
            }
          } else {
            // If we are skipping the auto-prompt because we just logged out,
            // we should still show the manual "Use Fingerprint" button so they have the option!
            setShowBiometricRetry(true);
          }
        }
      }
    } catch (e) {
      console.log('Session check error:', e);
    }
    setIsLoading(false);
  };

  const triggerBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access HLMS',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        await AsyncStorage.setItem('last_login', Date.now().toString());
        router.replace('/(tabs)');
      } else {
        // They cancelled or it failed. Show the retry button.
        setShowBiometricRetry(true);
      }
    } catch (e) {
      console.error(e);
      setShowBiometricRetry(true);
    }
  };

  const handleLogin = async () => {
    if (workerId.length < 3 || password.length < 4) {
      Alert.alert('Validation Error', 'Please enter a valid Employee ID and PIN.');
      return;
    }

    setIsLoading(true);
    try {
      const debuggerHost = Constants.expoConfig?.hostUri;
      const localIp = debuggerHost?.split(':')[0] || '10.0.2.2';
      
      const response = await fetch(`http://${localIp}:5000/ground_workers?empId=${workerId}`);
      const workers = await response.json();

      if (workers.length > 0) {
        const worker = workers[0];
        if (worker.pin === password) {
          // Success! Save session, timestamp, and full name for the header
          await AsyncStorage.setItem('user_empId', worker.empId);
          await AsyncStorage.setItem('user_fullName', worker.fullName);
          await AsyncStorage.setItem('last_login', Date.now().toString());
          router.replace('/(tabs)');
        } else {
          Alert.alert('Access Denied', 'Incorrect PIN. Please try again.');
        }
      } else {
        Alert.alert('Not Found', 'Employee ID does not exist in the system.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Cannot connect to the central server. Ensure you are on the same network.');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: 144, height: 144, resizeMode: 'contain', marginBottom: 10 }}
        />
        <Text style={styles.title}>Worker Access</Text>
        <Text style={styles.subtitle}>HLMS (Hospital Laundry Management System)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={[styles.input, isSessionLocked ? { backgroundColor: '#e2e8f0', color: '#64748b' } : {}]}
          placeholder="EMP-001"
          value={workerId}
          onChangeText={setWorkerId}
          autoCapitalize="characters"
          editable={!isSessionLocked} 
        />

        <Text style={styles.label}>PIN</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter Assigned PIN"
          value={password}
          onChangeText={setPassword}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN SAFELY</Text>
        </TouchableOpacity>
        
        {showBiometricRetry && (
          <TouchableOpacity style={styles.biometricBtn} onPress={triggerBiometrics}>
            <FontAwesome5 name="fingerprint" size={20} color={theme.primary} />
            <Text style={styles.biometricText}>Use Fingerprint</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSessionLocked ? (
        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={async () => {
          await AsyncStorage.clear();
          setWorkerId('');
          setPassword('');
          setIsSessionLocked(false);
          setShowBiometricRetry(false);
        }}>
          <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Not {workerId}? Switch Account</Text>
        </TouchableOpacity>
      ) : null}
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
  loginText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
  biometricBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 15, marginTop: 15, backgroundColor: '#e0f2fe', borderRadius: 10, borderWidth: 1, borderColor: '#bae6fd' },
  biometricText: { color: theme.primary, fontWeight: 'bold', fontSize: 16 }
});
