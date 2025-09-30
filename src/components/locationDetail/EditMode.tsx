import { useUpdateDetailLocation } from '@/src/services/queries/useLocation';
import { showAlert } from '@/utils/global';
import { useQueryClient } from '@tanstack/react-query';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableHighlight, View } from 'react-native';
type Props = {
  locationId: number;
  currentName: string;
  currentRadius: number;
  onChangeMode: Dispatch<SetStateAction<'VIEW' | 'EDIT'>>;
};
const EditMode = ({ currentName, currentRadius, locationId, onChangeMode }: Props) => {
  const [dataEdit, setDataEdit] = useState<{
    originalName: string;
    originalRadius: number;
    name: string;
    radius: number;
  }>({
    originalName: currentName,
    originalRadius: currentRadius,
    name: currentName,
    radius: currentRadius,
  });
  const queryClient = useQueryClient();
  const { mutateAsync: updateDetailLocation, isPending } = useUpdateDetailLocation();
  const isDirty =
    dataEdit.originalName !== dataEdit.name || dataEdit.originalRadius !== dataEdit.radius;
  const handleEdit = async () => {
    if (!dataEdit.name || !dataEdit.radius) {
      showAlert('Error', 'Không được để trống tên và bán kính');
      return;
    }
    await updateDetailLocation({
      id: locationId,
      name: dataEdit.name,
      radius: dataEdit.radius,
    });
    showAlert('Success', 'Cập nhật điểm thành công');
    onChangeMode('VIEW');
    queryClient.removeQueries({
      queryKey: ['location-detail-history', locationId],
    });
    queryClient.removeQueries({
      queryKey: ['location-history'],
    });
  };
  return (
    <>
      <Text className="text-lg font-semibold">Chỉnh sửa địa điểm</Text>
      <View className="gap-3 mt-6">
        <View className="gap-1">
          <Text className="text-sm font-medium">Tên địa điểm</Text>
          <TextInput
            className="p-3 border border-gray-300 rounded-lg"
            onChangeText={(text) => setDataEdit({ ...dataEdit, name: text })}
            editable
            placeholder="Nhập tên địa điểm"
            defaultValue={dataEdit.name}
          />
        </View>
        <View className="gap-1">
          <Text className="text-sm font-medium">Bán kính</Text>
          <TextInput
            className="p-3 border border-gray-300 rounded-lg"
            onChangeText={(text) => setDataEdit({ ...dataEdit, radius: Number(text) })}
            placeholder="Nhập bán kính"
            defaultValue={dataEdit.radius.toString()}
            editable
            keyboardType="number-pad" // khác numeric
            returnKeyType="done" // thêm nút Done trên iOS
          />
        </View>
      </View>
      <View className="absolute w-full gap-3 bottom-14 left-4 right-4">
        <TouchableHighlight
          underlayColor="#f0f0f0"
          className={`${isDirty ? '' : 'opacity-50'} bg-blue-500 rounded-lg`}
          onPress={handleEdit}
          disabled={isPending || !isDirty}
        >
          <View className="flex-row items-center justify-center gap-2 p-3 ">
            {isPending ? (
              <ActivityIndicator className="text-white" />
            ) : (
              <Text className="text-lg font-semibold text-white">Lưu thay đổi</Text>
            )}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          className="bg-gray-200 rounded-lg"
          onPress={() => onChangeMode('VIEW')}
          underlayColor="#f0f0f0"
        >
          <View className="flex-row items-center justify-center gap-2 p-3">
            <Text className="text-lg font-semibold text-black">Hủy</Text>
          </View>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default EditMode;
