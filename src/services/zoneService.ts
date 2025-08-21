// services/zoneService.ts
import api from './api';

export interface Zone {
  id: string;
  name: string;
  type: string;
  state: string;
  effectiveDate: string;
  expirationDate: string;
}

export interface ZoneResponse {
  success: boolean;
  message: string;
  data: {
    zones: Zone[];
  };
}

// /**
//  * Fetch zones from backend
//  * @param area - state code (default "FL")
//  * @param type - zone type (default "fire")
//  * @param page - pagination (optional)
//  * @param limit - pagination (optional)
//  * @param effective - filter by date (optional)
//  */
export const fetchZones = async (
  area: string = 'FL',
  type: string = 'fire',
  page?: number,
  limit?: number,
  effective?: string,
): Promise<Zone[]> => {
  const params: Record<string, any> = { area, type };

  //   if (page) params.page = page;
  //   if (limit) params.limit = limit;
  //   if (effective) params.effective = effective;

  const response = await api.get<ZoneResponse>('/weather/zones', { params });

  return response.data.data.zones;
};
