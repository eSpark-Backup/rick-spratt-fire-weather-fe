import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import CustomText from './CustomText';
import { Logout, SettingsIcon } from '../assets';

interface CustomTabBarProps {
  navigation: any;
  state: any; // you can add better typing here if you want
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ navigation, state }) => {
  const tabs = [
    {
      key: 'CloseApp',
      label: 'Close App',
      icon: <Logout height={24} width={24} />,
      navigateTo: 'SignIn',
    },
    {
      key: 'Settings',
      label: 'Settings',
      icon: <SettingsIcon height={28} width={28} />,
      navigateTo: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ key, label, icon, navigateTo }, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
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
            <View style={styles.iconWrapper}>{icon}</View>
            <CustomText
              style={[
                styles.label,
                isFocused ? styles.activeLabel : styles.inactiveLabel,
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
    color: '#005BBC',
  },
  inactiveLabel: {
    color: '#555555',
  },
});

export default CustomTabBar;
