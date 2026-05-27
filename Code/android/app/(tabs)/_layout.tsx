import React, { useState, useEffect, useRef } from 'react';
import { Tabs, router } from 'expo-router';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Image, TouchableOpacity, Text, View, Alert, Vibration, Platform } from 'react-native';
import { Audio } from 'expo-av';

// Custom header component injected globally into the App Navigation Bar
function GlobalHeader() {
  const [empName, setEmpName] = useState('Loading...');
  const [empId, setEmpId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      let name = await AsyncStorage.getItem('user_fullName');
      let id = await AsyncStorage.getItem('user_empId');
      
      if (id) {
        setEmpId(id);
        if (name) {
          setEmpName(name);
        } else {
          // Fallback if they bypassed login without fullName saved
          try {
            const Constants = require('expo-constants').default;
            const debuggerHost = Constants.expoConfig?.hostUri;
            const localIp = Platform.OS === 'web'
              ? '127.0.0.1'
              : (debuggerHost?.split(':')[0] || '10.0.2.2');
            const res = await fetch(`http://${localIp}:5000/ground_workers?empId=${id}`);
            const workers = await res.json();
            if (workers.length > 0) {
              setEmpName(workers[0].fullName);
              await AsyncStorage.setItem('user_fullName', workers[0].fullName);
            }
          } catch (e) {
            setEmpName('Unknown');
          }
        }
      } else {
        setEmpName('No Session');
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <Image source={require('../../assets/images/logo.png')} style={{width: 55, height: 55, resizeMode: 'contain', marginRight: 10}} />
      <View>
        <Text style={{fontWeight: '900', fontSize: 18, color: theme.textMain}}>HLMS Ground Ops</Text>
        <Text style={{fontWeight: '600', fontSize: 13, color: theme.textMuted}}>Active: {empName} ({empId})</Text>
      </View>
    </View>
  );
}

// Custom universal logout button for the right side of the header
function LogoutButton() {
  const handleWipeLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of your active shift?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out Safely", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.clear(); 
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

  return (
    <TouchableOpacity onPress={handleWipeLogout} style={{ padding: 8, marginRight: 10, backgroundColor: '#fee2e2', borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <MaterialIcons name="logout" size={18} color={theme.danger} />
      <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12}}>LOGOUT</Text>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const notifiedSosIds = useRef<Set<string>>(new Set());
  const isLoaded = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('notified_sos_ids').then(data => {
      if (data) {
        JSON.parse(data).forEach((id: string) => notifiedSosIds.current.add(id));
      }
      isLoaded.current = true;
    });

    let interval: any;
    
    const pollSOS = async () => {
      try {
        const Constants = require('expo-constants').default;
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localIp = Platform.OS === 'web'
          ? '127.0.0.1'
          : (debuggerHost?.split(':')[0] || '10.0.2.2');
        
        const res = await fetch(`http://${localIp}:5000/sos_requests`);
        const requests = await res.json();
        
        const pending = requests.filter((r: any) => r.status === 'Pending' || r.status === 'Active');
        
        if (!isLoaded.current) return;

        if (pending.length > 0) {
          // Sort to strictly get the single absolute newest request
          pending.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          const latestSos = pending[0];
          const sosIdStr = (latestSos._id || latestSos.id || '').toString();

          if (sosIdStr && !notifiedSosIds.current.has(sosIdStr)) {
            // New SOS found! Alert the worker globally.
            notifiedSosIds.current.add(sosIdStr);
            
            // Persist so it survives app reloads
            AsyncStorage.setItem('notified_sos_ids', JSON.stringify(Array.from(notifiedSosIds.current)));
            
            const timeStr = latestSos.timestamp ? new Date(latestSos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
            const itemsListStr = latestSos.requestedItems 
              ? latestSos.requestedItems.map((item: any) => `• ${item.qty}x ${item.item}`).join('\n')
              : '';

            // Play emergency vibration pattern infinitely
            Vibration.vibrate([0, 500, 200, 500], true);

            // Play emergency sound in loop
            const playEmergencySound = async () => {
              try {
                if (soundRef.current) {
                  await soundRef.current.unloadAsync();
                }
                const { sound } = await Audio.Sound.createAsync(
                  require('../../assets/SOS_alert_alarm.wav'),
                  { shouldPlay: true, isLooping: true }
                );
                soundRef.current = sound;
              } catch (err) {
                console.error("Failed to play emergency alert sound", err);
              }
            };
            playEmergencySound();

            Alert.alert(
              "🚨 EMERGENCY SOS REQUEST",
              `Ward: ${latestSos.ward} (Room ${latestSos.room})\nTime: ${timeStr}\n\nRequested Items:\n${itemsListStr}`,
              [
                { text: "Fulfill Now", onPress: async () => {
                   Vibration.cancel();
                   if (soundRef.current) {
                     try {
                       await soundRef.current.stopAsync();
                       await soundRef.current.unloadAsync();
                       soundRef.current = null;
                     } catch (e) {
                       console.error(e);
                     }
                   }
                   router.push({ pathname: '/(tabs)/distribute', params: { tab: 'EMERGENCY' } });
                }}
              ],
              { cancelable: false }
            );
          }
        }
      } catch (e) {
        // Silently fail if network is unreachable so it doesn't spam errors
      }
    };

    // Initial check
    pollSOS();
    
    // Poll every 10 seconds for real-time emergencies
    interval = setInterval(pollSOS, 10000);

    return () => {
      clearInterval(interval);
      Vibration.cancel();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textMuted,
      // The Global Header Setting
      headerShown: true,
      headerTitle: () => <GlobalHeader />,
      headerRight: () => <LogoutButton />,
      headerStyle: { backgroundColor: theme.card, elevation: 2, shadowOpacity: 0.1 },
      // Making bottom navigation bar chunky and accessible
      tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 10, backgroundColor: theme.card, elevation: 10, shadowOpacity: 0.2 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Hub', tabBarIcon: ({color}) => <FontAwesome5 name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="distribute" options={{ title: 'Distribute', tabBarIcon: ({color}) => <FontAwesome5 name="hand-holding-medical" size={24} color={color} /> }} />
      <Tabs.Screen name="collect" options={{ title: 'Collect', tabBarIcon: ({color}) => <MaterialIcons name="local-laundry-service" size={28} color={color} /> }} />
      <Tabs.Screen name="dispatch" options={{ title: 'Dispatch', tabBarIcon: ({color}) => <MaterialCommunityIcons name="truck-delivery" size={28} color={color} /> }} />
      <Tabs.Screen name="return" options={{ title: 'Return', tabBarIcon: ({color}) => <MaterialCommunityIcons name="clipboard-check" size={28} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color}) => <FontAwesome5 name="user-alt" size={22} color={color} /> }} />
      <Tabs.Screen name="records" options={{ href: null, title: 'Audit Logs' }} />
      <Tabs.Screen name="help" options={{ href: null, title: 'Help & Protocols' }} />
    </Tabs>
  );
}
