import crashlytics from '@react-native-firebase/crashlytics';

import api from './api';
type direction = number;

export type Threshold = {
  temperature: number;
  humidity: number;
  kbdi: {
    min: number;
    max: number;
  };
  dispersion_index: {
    min: number;
    max: number;
  };
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
  crashlytics().log('Thresholds setting API called');
  crashlytics().setAttribute('thresholds', JSON.stringify(response));
  return response.data;
};
