import AttendanceBottomSheet from '@/components/home/AttendanceBottomSheet';
import CardInfo from '@/components/home/CardInfo';
import HistoryAttendance from '@/components/home/HistoryAttendance';
import useLocation from '@/hooks/useLocation';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function Index() {
  const { latitude, longitude, address, isRefresh, setIsRefresh } = useLocation();

  const [reMount, setReMount] = useState<number>(0);

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
    </View>
  );
}
