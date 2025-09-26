import AttendanceBoxVariant1 from '@/components/attendanceVariants/AttendanceBoxVariant1';
import AttendanceBoxVariant2 from '@/components/attendanceVariants/AttendanceBoxVariant2';
import { AttendanceRes } from '@/types/Attendance';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
type Props = {
  data: AttendanceRes['data'];
  type: 'variant1' | 'variant2';
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<AttendanceRes, unknown>, Error>>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
};
const HistoryAttendance = ({ data, fetchNextPage, isLoading, isFetchingNextPage, type }: Props) => {
  switch (type) {
    case 'variant1':
      return (
        <AttendanceBoxVariant1
          data={data}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
        />
      );
    case 'variant2':
      return (
        <AttendanceBoxVariant2
          data={data}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
        />
      );
    default:
      return (
        <AttendanceBoxVariant1
          data={data}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
        />
      );
  }
};

export default HistoryAttendance;
