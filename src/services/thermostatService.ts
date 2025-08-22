import api from './api';

export interface Threshold {
  id: string;
  userId: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  southDir: number;
  northDir: number;
  eastDir: number;
  westDir: number;
  createdAt: string;
  updatedAt: string;
}

export const getThermostats = async (): Promise<{
  data: Threshold;
  message: string;
}> => {
  const response = await api.get('/threshold');
  return response.data;
};

export const setThermostats = async (
  payload: Threshold,
): Promise<{ message: string }> => {
  const response = await api.post('/threshold', payload);
  return response.data;
};
