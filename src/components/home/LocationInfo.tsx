import CircleRotation from '@/src/components/CircleRotation';
import Time from '@/src/components/Time';
import { copy } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

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
    <View className="gap-2 overflow-hidden border border-gray-300 rounded-2xl">
      <Time />
      <View className="px-4 gap-2 mt-2">
        <Pressable
          className="p-3 bg-[#F8F9FA] rounded-lg"
          onPress={() =>
            copy(`
               Địa chỉ: ${address}
               Vĩ độ: ${latitude}
               Kinh độ: ${longitude}`)
          }
        >
          <View className="flex-row items-center flex-shrink gap-2">
            <Feather name="map-pin" size={18} color="#3b82f6" />
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
        </Pressable>
        <View className="flex-row items-center gap-2 p-3 bg-[#F8F9FA] rounded-lg">
          <MaterialIcons name="gps-fixed" size={18} color="#3b82f6" />
          <Text className="bg-blue-500 w-28 p-2 rounded-full text-white text-[12px] text-center">
            chính xác 10m
          </Text>
        </View>
      </View>
      <Link href="/MapScreen" asChild className="mx-8 mb-8">
        <TouchableOpacity className="flex-row justify-center gap-2 p-3 mt-4 bg-[#0CA172] rounded-lg">
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
