import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { RootStackParamList } from './navigation';
import HomeScreen from '../screens/Home';
import NotificationsScreen from '../screens/Notification';
import SettingsScreen from '../screens/Settings';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import { getActiveRouteName, navigationRef } from './RootNavigation';
import Header from '../components/Header';
import { zoneData } from '../constants';
import CustomTabBar from '../components/CustomTabBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  console.log('that mounted');

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        header: () => (
          <Header
            username="James"
            locations={zoneData}
            onLocationSelect={loc => console.log(loc)}
          />
        ),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  // console.log('this mounted');
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isUserLoggedIn');
      console.log('isLoggedIn', isLoggedIn);
      setInitialRoute(isLoggedIn ? 'HomeTabs' : 'SignIn');
    } catch (e) {
      setInitialRoute('SignIn');
    }
  };

  if (!initialRoute) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF',
        }}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={initialRoute || 'SignIn'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  console.log('✅ RootNavigation mounted');
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: useSafeAreaInsets().top,
          paddingBottom: useSafeAreaInsets().bottom,
        },
      ]}
    >
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const currentScreen = getActiveRouteName();
          console.log('📍 Current screen:', currentScreen);
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
