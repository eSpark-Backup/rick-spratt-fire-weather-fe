import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/index';
import getDeviceToken from './src/utils/getDeviceToken';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  useEffect(() => {
    getDeviceToken();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle={'light-content'} />
          <RootNavigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
