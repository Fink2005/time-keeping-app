import AttendanceHandler from '@/components/home/AttendanceHandler';
import CardInfo from '@/components/home/CardInfo';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import useLocation from '@/hooks/useLocation';
import { useAuthStore } from '@/store/useAuthStore';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { View } from 'react-native';

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

  // const handleLogout = () => {
  //   setToken('');
  //   router.replace('/(screens)/(authScreen)/LoginScreen');
  // };

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
      <HistoryAttendance />

      {/* <Button title="Send Test Notification" onPress={sendLocalNotification} />
      <Pressable onPress={handleLogout}>
        <Text>login page</Text>
      </Pressable> */}
    </View>
  );
}
