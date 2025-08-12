// src/firebaseConfig.ts
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  projectId: 'fire-weather-alert',
  appId: '1:901823920988:android:dd8f9dd611e3a7aa52df99',
  apiKey: 'AIzaSyBZstSpeIhbWTZ9L2d2dXmaeI_1dsIV-5k',
  storageBucket: 'fire-weather-alert.firebasestorage.app',
  messagingSenderId: '901823920988',
  authDomain: 'fire-weather-alert.firebaseapp.com',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
