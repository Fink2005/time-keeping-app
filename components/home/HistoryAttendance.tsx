import { AttendanceRecord } from '@/types/Attendance';
import { getData } from '@/utils/asyncStorage';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const HistoryAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  useEffect(() => {
    getData('attendanceRecords').then((data: AttendanceRecord[]) => {
      setAttendanceRecords(data);
    });
  }, []);
  if (!attendanceRecords) {
    return;
  }
  return (
    <View className="flex-1 mt-4">
      <Text className="text-xl font-bold">Lịch sử gần đây</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={attendanceRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="gap-1 p-4 my-2 border border-gray-200 rounded-lg">
            <Text className="text-base font-medium">{item.createdAt}</Text>
            <Text>Kinh độ: {item.longitude}</Text>
            <Text>Vĩ độ: {item.latitude}</Text>
            <Text>Địa chỉ: {item.address}</Text>
            <Text>Loại: {item.type}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryAttendance;
