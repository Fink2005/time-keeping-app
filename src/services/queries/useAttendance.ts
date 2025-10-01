import { AttendanceType } from '@/enum/Attendance';
import attendanceRequest from '@/services/request/attendance';
import { useCommonStore } from '@/store/useCommonStore';
import {
  AttendanceByYearRes,
  AttendanceDetailRes,
  AttendanceReq,
  AttendanceRes,
} from '@/types/attendance';
import { showAlert } from '@/utils/global';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetInfiniteAttendance = (initialPage = 1) => {
  const setAttendanceType = useCommonStore((state) => state.setAttendanceType);

  return useInfiniteQuery<AttendanceRes, Error>({
    queryKey: ['attendance-history'],
    queryFn: async ({ pageParam = initialPage }): Promise<AttendanceRes> => {
      const response = await attendanceRequest.getAttendance(pageParam as number);

      const lastAttendanceType = response?.data[0].type === 'CHECK_IN';
      setAttendanceType(lastAttendanceType ? AttendanceType.CHECK_OUT : AttendanceType.CHECK_IN);

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
    initialPageParam: initialPage,
    // throwOnError(error) {
    //   if (error instanceof ApiException) {
    //     toast.error(error.message);
    //     return false;
    //   }
    //   return false;
    // },
    getNextPageParam: (lastPage: AttendanceRes) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useGetAttendanceByYear = (year: number) => {
  return useQuery<AttendanceByYearRes, Error>({
    queryKey: ['attendance', year],
    queryFn: async (): Promise<AttendanceByYearRes> => {
      const response = await attendanceRequest.getAttendanceByYear(year);
      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
  });
};

export const useGetInfiniteAttendanceDetail = (initialPage = 1, date: string) => {
  return useInfiniteQuery<AttendanceDetailRes, Error>({
    queryKey: ['attendance-detail-history'],
    queryFn: async ({ pageParam = initialPage }): Promise<AttendanceDetailRes> => {
      const response = await attendanceRequest.getAttendanceDetail(pageParam as number, date);

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
    staleTime: 0,
    initialPageParam: initialPage,

    getNextPageParam: (lastPage: AttendanceDetailRes) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRes, Error, AttendanceReq>({
    mutationKey: ['create-attendance'],
    mutationFn: async (data: AttendanceReq): Promise<AttendanceRes> => {
      const res = await attendanceRequest.createAttendance(data);
      if (!res) {
        throw new Error('Failed to create attendance');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      showAlert('Success', 'Chấm công thành công');
    },

    onError: () => {
      showAlert('Error', 'Chấm công thất bại, vui lòng thử lại');
    },
  });
};
