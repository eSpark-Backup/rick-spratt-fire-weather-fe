import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  zoneId: string;
  deviceToken: string;
}

// interface forgotPassPayload {
//   email: string;
// }

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload);
  console.log('login', response);
  return response.data;
};

export const signup = async (payload: SignupPayload) => {
  const response = await api.post('/auth/signup', payload);
  return response.data;
};

export const updateDeviceToken = async (deviceToken: string) => {
  const response = await api.patch('/auth/device-token', {
    deviceToken,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const resetPassword = async (payload: any) => {
  const response = await api.post('/auth/reset-password', payload);
  return response.data;
};
