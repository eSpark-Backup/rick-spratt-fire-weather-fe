import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import NotificationTile from '../../components/NotificationTile';
import { CloudCool } from '../../assets';
import { bgColor } from '../../constants/colors';

const notifications = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  icon: <CloudCool />,
  message: 'Lorem Ipsum is simply dummy text of the printing',
  time: '10 minutes ago',
}));

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {notifications.map(({ id, icon, message, time }) => (
          <NotificationTile
            key={id}
            icon={icon}
            message={message}
            time={time}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bgColor,
  },
  scrollViewContent: {
    paddingHorizontal: 12,
    flexGrow: 1,
  },
});
