import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import NotificationTile from '../../components/NotificationTile';
import { bgColor, primaryColor } from '../../constants/colors';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchAllNotifications } from '../../services/notificationService'; // 👈 where your thunk lives
import CustomText from '../../components/CustomText';
import { CloudCool } from '../../assets';

export default function NotificationsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notification,
  );

  useEffect(() => {
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <CustomText size={14} color="red">
            {error}
          </CustomText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {notifications.map(({ id, icon, body, createdAt }) => (
            <NotificationTile
              key={id}
              icon={icon?? <CloudCool />}
              message={body || ''}
              time={createdAt || ''}
            />
          ))}
        </ScrollView>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
