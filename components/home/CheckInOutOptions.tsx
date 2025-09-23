import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CheckInOutOptions = ({
  title,
  iconName,
  description,
  locationData,
  type,
  setReMount,
  setAttendanceType,
}: {
  title: string;
  iconName: keyof typeof Entypo.glyphMap;
  description: string;
  type: 'check-in' | 'check-out';
  locationData?: { latitude: number; longitude: number; address: string | null };
  setReMount?: React.Dispatch<React.SetStateAction<number>>;
  setAttendanceType?: React.Dispatch<React.SetStateAction<'check-in' | 'check-out'>>;
}) => {
  const router = useRouter();
  const handleCheckInOut = async () => {
    if (iconName === 'camera') {
      router.push('/(screens)/CheckInOutWithCamera');
      return;
    }
    if (!locationData || !locationData.address) {
      showAlert('Lỗi', 'Vui lòng bật định vị để chấm công');
      return;
    }
    try {
      const [getAttendanceStorage, getAttendanceType] = await Promise.allSettled([
        getData('attendanceRecords'),
        getData('attendanceType'),
      ]);

      if (getAttendanceType.status === 'fulfilled' && getAttendanceType.value === type) {
        await storeData('attendanceType', type === 'check-in' ? 'check-out' : 'check-in');
      }

      const locationStorage =
        getAttendanceStorage.status === 'fulfilled' ? getAttendanceStorage.value || [] : [];
      await storeData('attendanceRecords', [
        ...locationStorage,
        {
          id: uuidv4(),
          ...locationData,
          type,
          createdAt: new Date().toLocaleString(),
        },
      ]);
      setAttendanceType && setAttendanceType(type === 'check-in' ? 'check-out' : 'check-in');
      showAlert('Thành công', `Chấm công ${type === 'check-in' ? 'vào' : 'ra'} thành công`);
      setReMount && setReMount((prev) => prev + 1);
    } catch {
      showAlert('Lỗi', 'Chấm công thất bại, vui lòng thử lại');
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
