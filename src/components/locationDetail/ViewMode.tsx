import { useDeleteDetailLocation } from '@/src/services/queries/useLocation';
import { Feather } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native';
const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <View className="flex-row items-start mb-4">
    <Text className="w-1/3 text-gray-600">{label}</Text>
    <Text className="flex-1 text-base font-semibold -translate-y-[3px]" numberOfLines={0}>
      {value ?? '-'}
    </Text>
  </View>
);

type Props = {
  name: string;
  address: string;
  locationId: number;
  lng: string;
  lat: string;
  radius: number;
  createdAt: Date;
  onChangeMode: Dispatch<SetStateAction<'VIEW' | 'EDIT'>>;
};
const ViewMode = ({
  name,
  address,
  locationId,
  lng,
  lat,
  radius,
  createdAt,
  onChangeMode,
}: Props) => {
  const { mutate: deleteLocation, isPending } = useDeleteDetailLocation();

  const handleRemoveLocation = () => {
    Alert.alert(
      'Xóa mục này?',
      'Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            deleteLocation(locationId);
          },
        },
      ],
    );
  };
  return (
    <>
      <View className="px-10 py-6 border border-gray-200 rounded-lg">
        <DetailRow label="Tên" value={name} />

        <View className="flex-row items-center mb-4">
          <Text className="w-1/3 text-gray-600">Tọa độ</Text>
          <View className="-translate-x-1">
            <Text className="text-base font-semibold"> Kinh độ: {lng}</Text>
            <Text className="text-base font-semibold"> Vĩ độ: {lat}</Text>
          </View>
        </View>

        <DetailRow label="Địa chỉ" value={address} />

        <DetailRow label="Bán kính" value={`${radius} m`} />
        <DetailRow label="Tạo lúc" value={new Date(createdAt).toLocaleString()} />
      </View>
      <View className="absolute w-full gap-3 bottom-14 left-4 right-4">
        <TouchableHighlight
          underlayColor="#f0f0f0"
          className="bg-blue-500 rounded-lg "
          onPress={() => onChangeMode('EDIT')}
        >
          <View className="flex-row items-center justify-center gap-2 p-3 ">
            <Feather name="edit" size={20} color="white" />
            <Text className="text-lg font-semibold text-white">Cập nhật địa điểm</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          className="bg-red-500 rounded-lg"
          onPress={handleRemoveLocation}
          underlayColor="#f0f0f0"
        >
          <View className="flex-row items-center justify-center gap-2 p-3">
            {isPending ? (
              <ActivityIndicator className="text-white" />
            ) : (
              <>
                <Feather name="trash" size={20} color="white" />
                <Text className="text-lg font-semibold text-white">Xóa địa điểm</Text>
              </>
            )}
          </View>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default ViewMode;
