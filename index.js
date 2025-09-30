/**
 * @format
 */

import { AppRegistry } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import App from './App';
import { name as appName } from './app.json';


crashlytics().setCrashlyticsCollectionEnabled(true);

AppRegistry.registerComponent(appName, () => App);
