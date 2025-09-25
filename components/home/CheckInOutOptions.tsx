import { AttendanceType } from '@/enum/Attendance';
import attendanceRequest from '@/services/request/attendance';
import { showAlert } from '@/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import 'react-native-get-random-values';

const CheckInOutOptions = ({
  title,
  iconName,
  description,
  locationData,
  type,
  setAttendanceType,
}: {
  title: string;
  iconName: keyof typeof Entypo.glyphMap;
  description: string;
  type: AttendanceType | undefined;
  locationData?: { latitude: number; longitude: number; address: string | null };
  setAttendanceType?: (type: AttendanceType | undefined) => void;
}) => {
  const queryClient = useQueryClient();

  const handleCheckInOut = async () => {
    if (iconName === 'camera' || !setAttendanceType) {
      router.push('/(screens)/CheckInOutWithImage');
      return;
    }
    if (!locationData || !locationData.address) {
      showAlert('Lỗi', 'Vui lòng bật định vị để chấm công');
      return;
    }
    try {
      await attendanceRequest.createAttendance({
        address: locationData.address,
        lat: locationData.latitude.toString(),
        lng: locationData.longitude.toString(),
        type,
      });
      setAttendanceType(
        type === AttendanceType.CHECK_IN ? AttendanceType.CHECK_OUT : AttendanceType.CHECK_IN,
      );
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });

      showAlert(
        'Success',
        `Chấm công ${type === AttendanceType.CHECK_IN ? 'vào' : 'ra'} thành công`,
      );
    } catch {
      showAlert('Error', 'Chấm công thất bại, vui lòng thử lại');
    }
  };

  return (
    <TouchableHighlight
      underlayColor="#f0f0f0"
      className="p-4 my-2 border border-gray-300 rounded-xl"
      onPress={handleCheckInOut}
    >
      <View className="flex-row items-center gap-4">
        <View className="p-2 bg-gray-200 rounded-full">
          <Entypo name={iconName} size={24} color="black" />
        </View>
        <View>
          <Text className="text-lg font-bold">{title}</Text>
          <Text className="text-gray-500">{description}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default CheckInOutOptions;
