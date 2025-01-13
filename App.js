import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GettingDataScreen from './Screens/GettingDataScreen';
import DisplayDataScreen from './Screens/DisplayDataScreen';



export default function App() {


  const Stack = createNativeStackNavigator();

  const RootStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='GettingDataScreen' component={GettingDataScreen} />
      <Stack.Screen name='DisplayDataScreen' component={DisplayDataScreen} />
    </Stack.Navigator>
  );
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <RootStack />
    </NavigationContainer>
  );
}

