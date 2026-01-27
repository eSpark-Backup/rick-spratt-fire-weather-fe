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
    console.log('[getDeviceToken] Requesting user permission...');
    const permissionGranted = await requestUserPermission();
    console.log('[getDeviceToken] Permission granted:', permissionGranted);

    if (!permissionGranted) {
      console.log(
        '[getDeviceToken] Permission not granted, aborting token retrieval.',
      );
      return null;
    }

    let fcmToken = null;
    let apnsToken = null;

    if (Platform.OS === 'ios') {
      try {
        apnsToken = await messaging().getAPNSToken();
        if (apnsToken) {
          console.log('[getDeviceToken] 🍏 APNS Token retrieved:', apnsToken);
        } else {
          console.log('[getDeviceToken] 🍏 APNS Token is null or undefined.');
        }
      } catch (apnsError) {
        console.log(
          '[getDeviceToken] ❌ Error retrieving APNS token:',
          apnsError,
        );
      }
    }

    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('[getDeviceToken] 📲 FCM Token retrieved:', fcmToken);
      } else {
        console.log('[getDeviceToken] 📲 FCM Token is null or undefined.');
      }
    } catch (fcmError) {
      console.log('[getDeviceToken] ❌ Error retrieving FCM token:', fcmError);
    }

    console.log('[getDeviceToken] Device tokens retrieval result:', {
      fcmToken,
      apnsToken,
    });
    // 🔗 Send tokens to backend here if needed
    return Platform.OS === 'android'
      ? fcmToken
      : fcmToken
      ? fcmToken
      : apnsToken;
  } catch (error) {
    console.log(
      '[getDeviceToken] ❌ Unexpected error in device token retrieval:',
      error,
    );
    return null;
  }
}

// 👉 Setup notification listeners
export const setupNotificationListeners = () => {
  let alertShown = false;

  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground Notification:', remoteMessage);
    // Cancel previous alert if a new one arrives
    if (alertShown) {
      return;
    }

    alertShown = true;
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
      [
        {
          text: 'OK',
          onPress: () => {
            alertShown = false;
          },
        },
      ],
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
