import EditMode from '@/src/components/locationDetail/EditMode';
import ViewMode from '@/src/components/locationDetail/ViewMode';
import { useGetDetailLocation } from '@/src/services/queries/useLocation';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const LocationDetailScreen = () => {
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const { data: detailLocation, isLoading } = useGetDetailLocation(+locationId);
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  if (isLoading) {
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
      {mode === 'VIEW' && (
        <ViewMode
          address={detailLocation.address}
          createdAt={detailLocation.createdAt}
          locationId={+locationId}
          lat={detailLocation.lat}
          lng={detailLocation.lng}
          name={detailLocation.name}
          radius={detailLocation.radius}
          onChangeMode={setMode}
        />
      )}

      {mode === 'EDIT' && (
        <EditMode
          locationId={+locationId}
          currentName={detailLocation.name}
          currentRadius={detailLocation.radius}
          onChangeMode={setMode}
        />
      )}
    </View>
  );
};

export default LocationDetailScreen;
