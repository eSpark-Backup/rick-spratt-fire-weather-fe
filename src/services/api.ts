import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';

const api = axios.create({
  baseURL: 'https://4ed65161addf.ngrok-free.app/api',
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
