import CircleRotation from '@/components/CircleRotation';
import { copy } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const CardInfo = ({
  time,
  address,
  latitude,
  longitude,
  isRefresh,
  setIsRefresh,
}: {
  time: string;
  address: string | null;
  isRefresh: boolean;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  latitude: number;
  longitude: number;
}) => {
  return (
    <View className="gap-2 p-4 border border-gray-300 rounded-xl">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="calendar-clock-outline" size={18} />
        {time && <Text className="font-semibold">{time}</Text>}
      </View>
      <TouchableWithoutFeedback
        onPress={() =>
          copy(`
               Địa chỉ: ${address}
               Vĩ độ: ${latitude}
               Kinh độ: ${longitude}`)
        }
      >
        <View className="flex-row items-center gap-2">
          <Feather name="map-pin" size={18} />
          {address && (
            <Text className="font-semibold">
              {`${address}`} ({latitude.toFixed(2)}, {longitude.toFixed(2)})
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
        <TouchableOpacity className="flex-row justify-center gap-2 p-3 mt-4 bg-gray-200 rounded-lg">
          <Feather name="plus" size={24} color="black" />
          <Text className="text-xl font-semibold">Tạo địa điểm</Text>
        </TouchableOpacity>
      </Link>
      <View className="absolute right-3 top-3">
        <CircleRotation isRefresh={isRefresh} setIsRefresh={setIsRefresh} />
      </View>
    </View>
  );
};

export default CardInfo;
