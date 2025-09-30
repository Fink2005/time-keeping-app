import CircleRotation from '@/components/CircleRotation';
import Time from '@/components/Time';
import { copy } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const LocationInfo = ({
  address,
  latitude,
  longitude,
  isRefresh,
  setIsRefresh,
}: {
  address: string | null;
  isRefresh: boolean;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  latitude: number;
  longitude: number;
}) => {
  return (
    <View className="gap-2 p-4 border border-gray-300 rounded-xl">
      <Time />
      <TouchableWithoutFeedback
        onPress={() =>
          copy(`
               Địa chỉ: ${address}
               Vĩ độ: ${latitude}
               Kinh độ: ${longitude}`)
        }
      >
        <View className="flex-row items-center flex-shrink gap-2">
          <Feather name="map-pin" size={18} />
          {address && (
            <Text
              numberOfLines={1}
              className="flex-shrink font-semibold text-ellipsis"
              ellipsizeMode="tail"
            >
              {address}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="gps-fixed" size={18} />
        <Text className="bg-gray-700 w-28 p-2 rounded-full text-white text-[12px] text-center">
          chính xác 10m
        </Text>
      </View>
      <Link href="/MapScreen" asChild>
        <TouchableOpacity className="flex-row justify-center gap-2 p-3 mt-4 bg-green-500 rounded-lg">
          <Feather name="plus" size={24} color="white" />
          <Text className="text-xl font-semibold text-white">Tạo địa điểm</Text>
        </TouchableOpacity>
      </Link>
      <View className="absolute right-3 top-3">
        <CircleRotation isRefresh={isRefresh} setIsRefresh={setIsRefresh} />
      </View>
    </View>
  );
};

export default LocationInfo;
