import AttendanceBottomSheet from '@/components/home/AttendanceBottomSheet';
import CardInfo from '@/components/home/CardInfo';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import useLocation from '@/hooks/useLocation';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Button, View } from 'react-native';

export default function Index() {
  const { latitude, longitude, address, isRefresh, setIsRefresh } = useLocation();

  const [reMount, setReMount] = useState<number>(0);

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

  return (
    <View className="flex-1 p-5 bg-white">
      <CardInfo
        address={address}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        latitude={latitude}
        longitude={longitude}
      />
      <AttendanceBottomSheet
        setReMount={setReMount}
        latitude={latitude}
        longitude={longitude}
        address={address}
      />
      <HistoryAttendance key={reMount} />
      <Button title="Send Test Notification" onPress={sendLocalNotification} />
    </View>
  );
}
