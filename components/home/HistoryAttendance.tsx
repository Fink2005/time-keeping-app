import { AttendanceRecord } from '@/types/Attendance';
import { getData } from '@/utils/asyncStorage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

const HistoryAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    getData('attendanceRecords').then((data: AttendanceRecord[]) => {
      setAttendanceRecords(data?.reverse());
    });
  }, [isFocused]);
  if (!attendanceRecords?.length) {
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
          <View className="flex-row items-center p-4 my-2 border border-gray-200 rounded-lg">
            <View className={`${item.imageUri ? 'w-3/4' : ''} gap-1`}>
              <Text className="text-base font-medium">{item.createdAt}</Text>
              {/* <Text>Kinh độ: {item.longitude}</Text>
              <Text>Vĩ độ: {item.latitude}</Text> */}
              <Text numberOfLines={2}>Địa chỉ: {item.address}</Text>
              <Text>Loại: {item.type}</Text>
            </View>
            <View className="items-end flex-1">
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} className="rounded-lg size-10" />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryAttendance;
