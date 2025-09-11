import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CheckInOutOptions = ({
  title,
  iconName,
  description,
  locationData,
  setIsRefresh,
}: {
  title: string;
  iconName: keyof typeof Entypo.glyphMap;
  description: string;
  locationData?: { latitude: number; longitude: number; address: string | null };
  setIsRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCheckInOut = async () => {
    if (iconName === 'camera') {
      showAlert('Thông báo', 'Chức năng chấm công kèm ảnh đang được phát triển');
      return;
    }
    if (!locationData || !locationData.address) {
      showAlert('Lỗi', 'Vui lòng bật định vị để chấm công');
      return;
    }
    try {
      const oldAttendanceData = await getData('attendanceRecords');
      const locationStorage = oldAttendanceData || [];
      await storeData('attendanceRecords', [
        ...locationStorage,
        {
          id: uuidv4(),
          ...locationData,
          type: title.includes('vào') ? 'check-in' : 'check-out',
          createdAt: new Date().toLocaleString(),
        },
      ]);
      showAlert('Thành công', `Chấm công ${title.includes('vào') ? 'vào' : 'ra'} thành công`);
      setIsRefresh && setIsRefresh((prev) => !prev);
    } catch (error) {
      showAlert('Lỗi', 'Chấm công thất bại, vui lòng thử lại');
      console.log('Error saving attendance record:', error);
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
