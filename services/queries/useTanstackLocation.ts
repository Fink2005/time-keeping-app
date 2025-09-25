import locationRequest from '@/services/request/location';
import { LocationReq } from '@/types/Location';
import { showAlert } from '@/utils/global';
import { useMutation } from '@tanstack/react-query';

export const useTanstackLocation = () => {
  return useMutation({
    mutationKey: ['create-location'],
    mutationFn: async (data: LocationReq) => {
      const response = await locationRequest.createLocation(data);
      return response;
    },
    onSuccess: () => {
      showAlert('Success', 'Tạo vị trí thành công');
    },
    onError: () => {
      showAlert('Error', 'Tạo vị trí thất bại, vui lòng thử lại');
    },
  });
};
