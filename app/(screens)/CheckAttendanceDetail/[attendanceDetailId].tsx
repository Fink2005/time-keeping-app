import CalendarCustom from '@/components/CalendarCustom';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import { useGetAttendanceDetail } from '@/services/queries/useAttendance';
import { AttendanceDetailRes } from '@/types/Attendance';
import { dateFormatted, formatDate } from '@/utils/global';
import log from '@/utils/logger';
import { useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const AttendanceDetailScreen = () => {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const { attendanceDetailId } = useLocalSearchParams();
  const { data, isLoading, isFetchingNextPage, refetch, fetchNextPage } = useGetAttendanceDetail(
    1,
    attendanceDetailId as string,
  );
  log(attendanceDetailId);
  const attendanceDates = data?.pages.flatMap((page) => page.data) || [];
  const attendanceCalendar =
    data?.pages[0].dataCalendarAttendace || ({} as AttendanceDetailRes['dataCalendarAttendace']);

  const date = attendanceDates[0]?.createdAt;
  useEffect(() => {
    if (isFocused) {
      queryClient.removeQueries({ queryKey: ['attendance-detail-history'] });
      refetch();
    }
  }, [isFocused, refetch, queryClient]);
  return (
    <View className="flex-1 p-5 bg-white">
      <CalendarCustom initialDate={attendanceDetailId as string} markedDates={attendanceCalendar} />
      {date && (
        <Text className="mt-5 text-xl font-semibold">
          Chấm công ngày {formatDate(date, 'weekly')} {dateFormatted(date, 'SLASH')}
        </Text>
      )}
      <HistoryAttendance
        data={attendanceDates}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        type="variant2"
      />
    </View>
  );
};

export default AttendanceDetailScreen;
