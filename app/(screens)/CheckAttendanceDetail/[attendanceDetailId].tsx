import CalendarCustom from '@/components/CalendarCustom';
import React from 'react';
import { View } from 'react-native';
// const fetchAttendance = async () => {
//   const data: AttendanceBase[] = await getData('attendanceRecords');
//   return data;
// };
const AttendanceDetailScreen = () => {
  // const AttendanceData = use<AttendanceBase[]>(fetchAttendance());
  // log(AttendanceData);
  return (
    <View className="flex-1 p-5 bg-white">
      <CalendarCustom />
    </View>
  );
};

export default AttendanceDetailScreen;
