import api from './api';
type direction = number;

export type Threshold = {
  temperature: number;
  humidity: number;
  wind_speed: {
    N: {
      min: direction;
      max: direction;
    };
    NE: {
      min: direction;
      max: direction;
    };
    E: {
      min: direction;
      max: direction;
    };
    SE: {
      min: direction;
      max: direction;
    };
    S: {
      min: direction;
      max: direction;
    };
    SW: {
      min: direction;
      max: direction;
    };
    W: {
      min: direction;
      max: direction;
    };
    NW: {
      min: direction;
      max: direction;
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
