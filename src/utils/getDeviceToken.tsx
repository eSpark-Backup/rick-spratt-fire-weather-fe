import messaging from '@react-native-firebase/messaging';

async function getDeviceToken() {
  const token = await messaging().getToken();
  console.log('Device FCM Token:', token);
  return token;
}

export default getDeviceToken;
