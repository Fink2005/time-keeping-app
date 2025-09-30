import CalendarCustom from '@/src/components/CalendarCustom';
import HistoryAttendance from '@/src/components/home/HistoryAttendance';
import { useGetInfiniteAttendanceDetail } from '@/src/services/queries/useAttendance';
import { AttendanceDetailRes } from '@/types/attendance';
import { dateFormatted, formatDate } from '@/utils/global';
import { useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const AttendanceDetailScreen = () => {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const { attendanceDetailId } = useLocalSearchParams();
  const [attendanceDate, setAttendanceDate] = useState(attendanceDetailId as string);
  const { data, isLoading, isRefetching, isFetchingNextPage, refetch, fetchNextPage } =
    useGetInfiniteAttendanceDetail(1, attendanceDate);

  const attendanceDates = data?.pages.flatMap((page) => page.data) || [];
  const attendanceCalendar =
    data?.pages[0].dataCalendarAttendace || ({} as AttendanceDetailRes['dataCalendarAttendace']);

  const handleRefetch = (date?: string) => {
    queryClient.removeQueries({ queryKey: ['attendance-detail-history'] });
    if (date) {
      setAttendanceDate(date);
    } else {
      refetch();
    }
  };

  const date = attendanceDates[0]?.createdAt;
  useEffect(() => {
    if (isFocused) {
      handleRefetch();
    }
  }, [isFocused, refetch, queryClient]);
  return (
    <View className="flex-1 p-5 bg-white">
      <CalendarCustom
        onRefetch={handleRefetch}
        initialDate={attendanceDetailId as string}
        markedDates={attendanceCalendar}
      />
      {date && (
        <Text className="mt-5 text-xl font-semibold">
          Chấm công ngày {formatDate(date, 'weekly')} {dateFormatted(date, 'SLASH')}
        </Text>
      )}
      <HistoryAttendance
        data={attendanceDates}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isRefetching={isRefetching}
        isFetchingNextPage={isFetchingNextPage}
        type="variant2"
      />
    </View>
  );
};

export default AttendanceDetailScreen;
