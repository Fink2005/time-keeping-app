import AttendanceBottomSheet from '@/components/home/AttendanceBottomSheet';
import CardInfo from '@/components/home/CardInfo';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import useLocation from '@/hooks/useLocation';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function Index() {
  const [time, setTime] = useState<string>('');
  const { latitude, longitude, address, isRefresh, setIsRefresh } = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 p-5 bg-white">
      <CardInfo
        address={address}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        latitude={latitude}
        longitude={longitude}
        time={time}
      />
      <AttendanceBottomSheet
        setIsRefresh={setIsRefresh}
        latitude={latitude}
        longitude={longitude}
        address={address}
      />
      <HistoryAttendance key={Number(isRefresh)} />
    </View>
  );
}
