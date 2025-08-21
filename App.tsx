import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/index';
import getDeviceToken from './src/utils/getDeviceToken';

export default function App() {
  useEffect(() => {
    getDeviceToken();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigation />
    </SafeAreaProvider>
  );
}
