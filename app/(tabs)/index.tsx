import AttendanceHandler from '@/components/home/AttendanceHandler';
import CardInfo from '@/components/home/CardInfo';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import useLocation from '@/hooks/useLocation';
import { useGetInfiniteAttendance } from '@/services/queries/useAttendance';
import { useAuthStore } from '@/store/useAuthStore';
import { AttendanceRes } from '@/types/Attendance';
import { useIsFocused } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Pressable, Text, View } from 'react-native';
export default function Home() {
  const { latitude, longitude, address, isRefresh, setIsRefresh } = useLocation();

  const { setToken } = useAuthStore();

  // Schedule a local notification
  async function sendLocalNotification() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications not granted!');
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hello 👋',
        body: 'This is a test notification',
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 }, // show after 2 seconds
    });
  }

  const handleLogout = () => {
    setToken('');
    router.replace('/(screens)/(authScreen)/LoginScreen');
  };

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
      <CardInfo
        address={address}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        latitude={latitude}
        longitude={longitude}
      />
      <AttendanceHandler latitude={latitude} longitude={longitude} address={address} />
      <HistoryAttendance
        data={attendanceData}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        type="variant1"
      />

      <Button title="Send Test Notification" onPress={sendLocalNotification} />
      <Pressable onPress={handleLogout}>
        <Text>login page</Text>
      </Pressable>
    </View>
  );
}
