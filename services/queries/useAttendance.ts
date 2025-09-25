import { AttendanceType } from '@/enum/Attendance';
import attendanceRequest from '@/services/request/attendance';
import { useCommonStore } from '@/store/useCommonStore';
import { AttendanceRes } from '@/types/Attendance';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useAttendance = (initialPage = 1) => {
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
