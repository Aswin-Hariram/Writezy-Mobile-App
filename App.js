import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GettingDataScreen from './Screens/GettingDataScreen';
import DisplayDataScreen from './Screens/DisplayDataScreen';  // Import SplashScreen

import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function App() {
  const [loaded, error] = useFonts({
    'Delius-Regular': require('./assets/Fonts/Delius-Regular.ttf'),
    'Lexend-VariableFont_wght': require('./assets/Fonts/Lexend-VariableFont_wght.ttf'),
    'Zain-Regular': require('./assets/Fonts/Zain-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
       // Hide SplashScreen after fonts are loaded
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;  // Show nothing while fonts are loading
  }

  const Stack = createNativeStackNavigator();

  const RootStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='DisplayDataScreen' component={DisplayDataScreen} />
      <Stack.Screen name='GettingDataScreen' component={GettingDataScreen} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <RootStack />
    </NavigationContainer>
  );
}
