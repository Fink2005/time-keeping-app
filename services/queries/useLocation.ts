import locationRequest from '@/services/request/location';
import {
  LocationDetailRes,
  LocationReq,
  LocationRes,
  LocationUpdateDetailReq,
} from '@/types/location';
import { showAlert } from '@/utils/global';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-location'],
    mutationFn: async (data: LocationReq) => {
      const response = await locationRequest.createLocation(data);
      return response;
    },
    onSuccess: () => {
      showAlert('Success', 'Tạo vị trí thành công');
      queryClient.removeQueries({ queryKey: ['location-history'] });
      router.push('/(tabs)/Location');
    },
    onError: () => {
      showAlert('Error', 'Tạo vị trí thất bại, vui lòng thử lại');
    },
  });
};

export const useGetLocation = (initialPage = 1) => {
  return useInfiniteQuery<LocationRes, Error>({
    queryKey: ['location-history'],
    queryFn: async ({ pageParam = initialPage }): Promise<LocationRes> => {
      const response = await locationRequest.getLocation(pageParam as number);

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage: LocationRes) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useGetDetailLocation = (id: number) => {
  return useQuery<LocationDetailRes, Error>({
    queryKey: ['location-detail-history', id],
    queryFn: async (): Promise<LocationDetailRes> => {
      const response = await locationRequest.getLocationDetail(id);
      if (!response) {
        throw new Error('Location detail not found');
      }
      return response;
    },
  });
};

export const useUpdateDetailLocation = () => {
  return useMutation<LocationDetailRes, Error, LocationUpdateDetailReq>({
    mutationKey: ['update-detail-location'],
    mutationFn: async (data: LocationUpdateDetailReq): Promise<LocationDetailRes> => {
      const response = await locationRequest.updateLocation(data);
      if (!response) {
        throw new Error('Failed to update location');
      }
      return response;
    },

    onError: () => {
      showAlert('Error', 'Cập nhật điểm thất bại, vui lòng thử lại');
    },
  });
};
export const useDeleteDetailLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-detail-location'],
    mutationFn: async (id: number) => {
      const response = await locationRequest.deleteLocation(id);
      return response;
    },
    onSuccess: () => {
      showAlert('Success', 'Xóa địa điểm thành công');
      queryClient.removeQueries({ queryKey: ['location-history'] });
      router.back();
    },
    onError: () => {
      showAlert('Error', 'Xóa địa điểm thất bại, vui lòng thử lại');
    },
  });
};
