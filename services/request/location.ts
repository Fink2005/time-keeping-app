import { http } from '@/services/apiRequest';
import { LocationDetailRes, LocationReq } from '@/types/Location';

const locationRequest = {
  createLocation: async (data: LocationReq) => {
    return await http.post('/location/create', data);
  },

  getLocationDetail: async (id: number): Promise<LocationDetailRes | null> => {
    return await http.get<LocationDetailRes | null>(`/location/${id}`);
  },
};

export default locationRequest;
