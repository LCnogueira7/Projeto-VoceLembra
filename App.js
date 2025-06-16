import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TaskScreen from './screens/TaskScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import FinancaScreen from './screens/FinancaScreen';
import AboutScreen from './screens/AboutScreen';

// Cria Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} />
        <Stack.Screen name="tarefas" component={TaskScreen}
        options={{ headerShown: false}} />
        <Stack.Screen name="compras" component={PurchaseScreen}
        options={{ headerShown: false}} />
        <Stack.Screen name="finanças" component={FinancaScreen}
        options={{ headerShown: false}} /> 
        <Stack.Screen name="sobre" component={AboutScreen}
        options={{ headerShown: false}} /> 
        </Stack.Navigator>
    </NavigationContainer>
  );
}
