import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle token expiry
api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Clear storage (optional)
      await AsyncStorage.removeItem('authToken');

      // Redirect to login
      navigate('SignIn');
    }

    return Promise.reject(error);
  },
);

export default api;
