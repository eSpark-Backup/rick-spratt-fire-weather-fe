import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/index';

export default function App() {
  console.log('✅ App.tsx loaded');
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigation />
    </SafeAreaProvider>
  );
}
