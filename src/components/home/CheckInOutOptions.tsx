import { AttendanceType } from '@/src/enum/Attendance';
import { useCreateAttendance } from '@/src/services/queries/useAttendance';
import { useGetLocation } from '@/src/services/queries/useLocation';
import { LocationRes } from '@/src/types/location';
import { showAlert } from '@/src/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { isPointWithinRadius } from 'geolib';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import 'react-native-get-random-values';
type Props = {
  title: string;
  iconName: keyof typeof Entypo.glyphMap;
  description: string;
  type: AttendanceType | undefined;
  locationData?: { latitude: number; longitude: number; address: string | null };
  setAttendanceType?: (type: AttendanceType | undefined) => void;
  noteValue?: string;
};
const CheckInOutOptions = ({
  title,
  iconName,
  description,
  locationData,
  type,
  noteValue,
  setAttendanceType,
}: Props) => {
  const { mutate: createAttendance } = useCreateAttendance();
  const { data } = useGetLocation();

  const offices = data?.pages.flatMap((page: LocationRes) => page.data) || [];
  const handleCheckInOut = async () => {
    if (iconName === 'camera' || !setAttendanceType) {
      router.push(`/(screens)/CheckInOutImageScreen/${noteValue || 'default'}`);
      return;
    }
    if (!locationData || !locationData.address) {
      showAlert('Lỗi', 'Vui lòng bật định vị để chấm công');
      return;
    }

    const matchedOffice = offices?.find((office) =>
      isPointWithinRadius(
        {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        {
          latitude: office.lat,
          longitude: office.lng,
        },
        office.radius,
      ),
    );
    const locationId = matchedOffice?.id ? matchedOffice.id : undefined;

    createAttendance({
      address: locationData.address,
      lat: locationData.latitude.toString(),
      lng: locationData.longitude.toString(),
      type,
      ...(noteValue && { note: noteValue }),
      ...(locationId && { locationId }),
    });
    setAttendanceType(
      type === AttendanceType.CHECK_IN ? AttendanceType.CHECK_OUT : AttendanceType.CHECK_IN,
    );
  };

  return (
    <TouchableHighlight
      underlayColor="#f0f0f0"
      className="p-4 my-2 border border-gray-300 rounded-xl"
      onPress={handleCheckInOut}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={`p-3 ${iconName === 'camera' ? 'bg-blue-500' : 'bg-yellow-500'} rounded-full`}
        >
          <Entypo name={iconName} size={24} color="white" />
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
