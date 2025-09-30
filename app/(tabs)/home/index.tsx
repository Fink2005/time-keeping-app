import AttendanceHandler from '@/components/home/AttendanceHandler';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import LocationInfo from '@/components/home/LocationInfo';
import useLocation from '@/hooks/useLocation';
import { useGetInfiniteAttendance } from '@/services/queries/useAttendance';
import { AttendanceRes } from '@/types/attendance';
import { useIsFocused } from '@react-navigation/native';
// import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
export default function HomeScreen() {
  const { latitude, longitude, address, isRefresh, setIsRefresh } = useLocation();

  // Schedule a local notification
  // async function sendLocalNotification() {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Permission for notifications not granted!');
  //   }
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'Hello 👋',
  //       body: 'This is a test notification',
  //       sound: true,
  //     },
  //     trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 }, // show after 2 seconds
  //   });
  // }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, refetch } =
    useGetInfiniteAttendance();

  const attendanceData = data?.pages.flatMap((page: AttendanceRes) => page.data) || [];

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  return (
    <View className="flex-1 p-5 bg-white">
      <LocationInfo
        address={address}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        latitude={latitude}
        longitude={longitude}
      />
      <AttendanceHandler latitude={latitude} longitude={longitude} address={address} />
      <Text className="mt-5 mb-2 text-lg font-bold">Lịch sử chấm công</Text>
      <HistoryAttendance
        data={attendanceData}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        type="variant1"
      />
    </View>
  );
}
