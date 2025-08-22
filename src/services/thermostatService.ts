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

export type ThresholdPayload = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  southDir: number;
  northDir: number;
  eastDir: number;
  westDir: number;
};

export const getThermostats = async (): Promise<{
  data: Threshold;
  message: string;
}> => {
  const response = await api.get('/threshold');
  return response.data;
};

export const setThermostats = async (
  payload: ThresholdPayload,
): Promise<{ message: string }> => {
  const response = await api.post('/threshold', payload);
  return response.data;
};
