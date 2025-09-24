import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from './navigation';
import HomeScreen from '../screens/Home';
import NotificationsScreen from '../screens/Notification';
import SettingsScreen from '../screens/Settings';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import ZoneSelection from '../screens/ZoneSelection';
import { getActiveRouteName, navigationRef } from './RootNavigation';
import Header from '../components/Header';
import { zoneData } from '../constants';
import CustomTabBar from '../components/CustomTabBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomText from '../components/CustomText';

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
  const navigation = useNavigation();

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
      <Stack.Screen
        name="ZoneSelection"
        component={ZoneSelection}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true, // Change this to true
          header: () => (
            <Header username="" locations={[]} onLocationSelect={() => {}} /> // Add the Header component here
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  console.log('✅ RootNavigation mounted');
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safeArea,
        // {
        //   paddingTop: useSafeAreaInsets().top,
        //   paddingBottom: useSafeAreaInsets().bottom,
        // },
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
