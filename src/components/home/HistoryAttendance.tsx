import AttendanceBoxVariant1 from '@/src/components/attendanceVariants/AttendanceBoxVariant1';
import AttendanceBoxVariant2 from '@/src/components/attendanceVariants/AttendanceBoxVariant2';
import { AttendanceRes } from '@/types/attendance';
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
  isRefetching?: boolean;
  isFetchingNextPage: boolean;
};
const HistoryAttendance = ({
  data,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
  isRefetching,
  type,
}: Props) => {
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
          isRefetching={isRefetching}
          isFetchingNextPage={isFetchingNextPage}
        />
      );
    default:
      return (
        <AttendanceBoxVariant1
          data={data}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isFetchingNextPage={isFetchingNextPage}
        />
      );
  }
};

export default HistoryAttendance;
