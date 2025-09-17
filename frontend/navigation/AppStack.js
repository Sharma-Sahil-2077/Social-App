import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home"  options={{ headerShown: false }}  component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

    

    </Stack.Navigator>
  );
}
