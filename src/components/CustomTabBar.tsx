import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import CustomText from './CustomText';
import { ActiveSettingsIcon, Logout, SettingsIcon } from '../assets';
import { primaryColor } from '../constants/colors';
import { getActiveRouteName } from '../navigation/RootNavigation';
import { CustomTabBarProps } from '../types';
import { logout } from '../redux/slices/authSlice';

const TABS = [
  {
    key: 'CloseApp',
    label: 'Close App',
    icon: <Logout height={24} width={24} />,
    navigateTo: 'SignIn',
    isLogout: true, // 🔑 add flag
  },
  {
    key: 'Settings',
    label: 'Settings',
    icon: (active: boolean) =>
      active ? (
        <ActiveSettingsIcon height={28} width={28} />
      ) : (
        <SettingsIcon height={28} width={28} />
      ),
    navigateTo: 'Settings',
  },
];

const CustomTabBar: React.FC<CustomTabBarProps> = ({ navigation, state }) => {
  const currentScreen = getActiveRouteName();
  const dispatch = useDispatch();

  const handleLogout = async (navigateTo: string) => {
    try {
      await AsyncStorage.removeItem('authToken');
      dispatch(logout());
    } catch (err) {
      console.error('Error clearing token:', err);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: navigateTo }],
    });
  };

  return (
    <View style={styles.container}>
      {TABS.map(({ key, label, icon, navigateTo, isLogout }, index) => {
        const isFocused = state.index === index;
        const isSettings = label === 'Settings';
        const tabIcon =
          typeof icon === 'function'
            ? icon(currentScreen === 'Settings')
            : icon;

        const onPress = () => {
          if (isLogout) {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'OK',
                  onPress: () => handleLogout(navigateTo),
                },
              ],
              { cancelable: true }
            );
          } else if (currentScreen !== navigateTo) {
            navigation.navigate(navigateTo);
          }
        };

        return (
          <TouchableOpacity
            key={key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>{tabIcon}</View>
            <CustomText
              style={[
                styles.label,
                isFocused && isSettings
                  ? styles.activeLabel
                  : styles.inactiveLabel,
              ]}
              size={12}
            >
              {label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 15,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
  },
  activeLabel: {
    color: primaryColor,
  },
  inactiveLabel: {
    color: '#555555',
  },
});

export default CustomTabBar;