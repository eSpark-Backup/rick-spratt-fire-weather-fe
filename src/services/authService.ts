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
  return response.data;
};

export const signup = async (payload: SignupPayload) => {
  const response = await api.post('/auth/signup', payload);
  return response.data;
};

// export const forgotPassword = async (payload: forgotPassPayload) => {
//   const response = await api.post('/users/forgot-password', payload);
//   return response.data;
// };
