import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

// 👉 Request user permission (iOS + Android 13+)
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted:', authStatus);
    return true;
  } else {
    console.log('Notification permission denied');
    return false;
  }
};

// 👉 Get FCM Token
async function getDeviceToken() {
  try {
    const permissionGranted = await requestUserPermission();
    console.log('permission granted: ', permissionGranted);

    if (!permissionGranted) return null;

    const token = await messaging().getToken();
    console.log('📲 Device FCM Token:', token);

    // 🔗 Send token to backend here if needed
    return token;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

// 👉 Setup notification listeners
export const setupNotificationListeners = () => {
  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground Notification:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
    );
  });

  // Background opened notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📩 Notification opened from background state:', remoteMessage);
  });

  // Quit-state opened notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('📩 Notification opened from quit state:', remoteMessage);
      }
    });
};

export default getDeviceToken;
