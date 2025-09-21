import api from './api'; // <-- your axios instance

export interface WeatherObservation {
  timestamp: string;
  temperatureF: number;
  relativeHumidity: number;
  windDirection: number;
  windSpeedMph: number;
}

export interface WeatherMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface WeatherResponse {
  success: boolean;
  message: string;
  data: {
    weather: WeatherObservation[];
    meta: WeatherMeta;
  };
}

export const fetchWeatherObservations = async (
  zoneId: string,
): Promise<WeatherObservation[]> => {
  try {
    const response = await api.get<WeatherResponse>(
      `/weather/zones/forecast/${zoneId}/observations?limit=1`,
    );
    console.log('Fetched weather observations:', response.data.data.weather);
    return response.data.data.weather;
  } catch (error: any) {
    console.error('Error fetching weather observations:', error);
    throw error;
  }
};
