import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import CustomText from './CustomText';
import { ActiveSettingsIcon, Logout, SettingsIcon } from '../assets';
import { primaryColor } from '../constants/colors';
import { getActiveRouteName } from '../navigation/RootNavigation';
import { CustomTabBarProps } from '../types';

const TABS = [
  {
    key: 'CloseApp',
    label: 'Close App',
    icon: <Logout height={24} width={24} />,
    navigateTo: 'SignIn',
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

  return (
    <View style={styles.container}>
      {TABS.map(({ key, label, icon, navigateTo }, index) => {
        const isFocused = state.index === index;
        const isSettings = label === 'Settings';
        const tabIcon =
          typeof icon === 'function'
            ? icon(currentScreen === 'Settings')
            : icon;

        const onPress = () => {
          if (currentScreen !== navigateTo) {
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
