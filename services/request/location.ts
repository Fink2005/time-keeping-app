import { LOCATION_LIMIT } from '@/constants/global';
import { http } from '@/services/apiRequest';
import {
  LocationDetailRes,
  LocationReq,
  LocationRes,
  LocationUpdateDetailReq,
} from '@/types/Location';

const locationRequest = {
  createLocation: async (data: LocationReq) => {
    return await http.post('/location/create', data);
  },

  getLocation: async (page: number): Promise<LocationRes | null> => {
    return await http.get<LocationRes | null>(
      `/location/list?page=${page}&limit=${LOCATION_LIMIT}`,
    );
  },
  getLocationDetail: async (id: number): Promise<LocationDetailRes | null> => {
    return await http.get<LocationDetailRes | null>(`/location/${id}`);
  },
  updateLocation: async (data: LocationUpdateDetailReq): Promise<LocationDetailRes | null> => {
    return await http.patch(`/location/update`, data);
  },
  deleteLocation: async (id: number): Promise<{ message: string } | null> => {
    return await http.delete<{ message: string }>(`/location/${id}`);
  },
};

export default locationRequest;
