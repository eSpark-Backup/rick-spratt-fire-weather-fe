import api from './api';

export type Threshold = {
  temperature: number;
  humidity: number;
  wind_speed: {
    N: {
      min: number;
      max: number;
    };
    NE: {
      min: number;
      max: number;
    };
    E: {
      min: number;
      max: number;
    };
    SE: {
      min: number;
      max: number;
    };
    S: {
      min: number;
      max: number;
    };
    SW: {
      min: number;
      max: number;
    };
    W: {
      min: number;
      max: number;
    };
    NW: {
      min: number;
      max: number;
    };
  };
};

export const getThermostats = async (): Promise<{
  data: Threshold;
  message: string;
}> => {
  const response = await api.get('/threshold');
  console.log('🚀 ~ getThermostats ~ response:', response.data.data);
  return response.data;
};

export const setThermostats = async (
  payload: Threshold,
): Promise<{ message: string }> => {
  const response = await api.post('/threshold', payload);
  return response.data;
};
