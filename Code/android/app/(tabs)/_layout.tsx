import { Tabs, router } from 'expo-router';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Image, TouchableOpacity, Text, View } from 'react-native';

// Custom header component injected globally into the App Navigation Bar
function GlobalHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <Image source={require('../../assets/images/logo.png')} style={{width: 55, height: 55, resizeMode: 'contain', marginRight: 10}} />
      <View>
        <Text style={{fontWeight: '900', fontSize: 18, color: theme.textMain}}>HLM Ground Ops</Text>
        <Text style={{fontWeight: '600', fontSize: 13, color: theme.textMuted}}>Active: John Doe (EMP-8042)</Text>
      </View>
    </View>
  );
}

// Custom universal logout button for the right side of the header
function LogoutButton() {
  const handleWipeLogout = () => {
    // Navigating explicitly to root authentication boundary
    router.replace('/login');
  };

  return (
    <TouchableOpacity onPress={handleWipeLogout} style={{ padding: 8, marginRight: 10, backgroundColor: '#fee2e2', borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <MaterialIcons name="logout" size={18} color={theme.danger} />
      <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12}}>LOGOUT</Text>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
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
