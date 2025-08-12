import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';

import { RootStackParamList } from './navigation';
import HomeScreen from '../screens/Home';
import HomeInnerScreen from '../screens/HomeInner';
import NotificationsScreen from '../screens/Notification';
import SettingsScreen from '../screens/Settings';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import { getActiveRouteName, navigationRef } from './RootNavigation';
import Header from '../components/Header';
import { zoneData } from '../constants';
import CustomTabBar from '../components/CustomTabBar';

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
  console.log('this mounted');

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
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
    <SafeAreaView style={styles.safeArea}>
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
