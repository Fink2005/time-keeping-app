import { AttendanceBase } from '@/types/Attendance';
import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native';

const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <View className="flex-row items-start mb-4">
    <Text className="w-1/3 text-gray-600">{label}</Text>
    <Text className="flex-1 text-base font-semibold" numberOfLines={0}>
      {value ?? '-'}
    </Text>
  </View>
);

const LocationDetailScreen = () => {
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const [detailLocation, setDetailLocation] = useState<AttendanceBase | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const removeLocation = () => {
    getData('myLocation').then((data) => {
      Alert.alert(
        'Xóa mục này?',
        'Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              const filteredData = (data || []).filter((item: Locations) => item.id !== locationId);

              try {
                await storeData('myLocation', filteredData);
                showAlert('Success', 'Xóa địa điểm thành công');
                router.back();
              } catch (error) {
                showAlert('Error', 'Xóa địa điểm thất bại');
                console.error('Error deleting location:', error);
              }
            },
          },
        ],
      );
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = (await getData('myLocation')) as AttendanceBase[];
        const location = data?.find((item) => item.id === locationId) || null;
        setDetailLocation(location);
      } catch (error) {
        console.error('Failed to load location details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) fetchLocation();
  }, [locationId]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!detailLocation) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="text-base font-semibold text-gray-600">Không tìm thấy địa điểm</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="px-10 py-6 border border-gray-200 rounded-lg">
        <DetailRow label="Tên" value={detailLocation.location} />

        <View className="flex-row items-center mb-4">
          <Text className="w-1/3 text-gray-600">Tọa độ</Text>
          <View className="-translate-x-1">
            <Text className="text-base font-semibold"> Kinh độ: {detailLocation.longitude}</Text>
            <Text className="text-base font-semibold"> Vĩ độ: {detailLocation.latitude}</Text>
          </View>
        </View>

        <DetailRow label="Địa chỉ" value={detailLocation.address} />

        <DetailRow label="Bán kính" value={`${detailLocation.radius} m`} />
        <DetailRow label="Tạo lúc" value={detailLocation.createdAt} />
      </View>

      <View className="absolute gap-3 bottom-14 left-4 right-4">
        <TouchableHighlight
          className="bg-red-500 rounded-lg"
          onPress={removeLocation}
          underlayColor="#f0f0f0"
        >
          <View className="flex-row items-center justify-center gap-2 p-3">
            <Feather name="trash" size={20} color="white" />
            <Text className="text-lg font-semibold text-white">Xóa địa điểm</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#f0f0f0"
          className="bg-white border border-gray-300 rounded-lg "
          onPress={() => router.back()}
        >
          <View className="flex-row items-center justify-center gap-2 p-3 ">
            <Text className="text-lg font-semibold text-black">Đóng</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default LocationDetailScreen;
