import CircleRotation from '@/src/components/CircleRotation';
import { useGetLocation } from '@/src/services/queries/useLocation';
import { LocationRes } from '@/types/location';
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';

const Location = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused();

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useGetLocation();

  const locationData = data?.pages.flatMap((page: LocationRes) => page.data) || [];

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xl font-bold">Địa điểm của bạn</Text>
        <CircleRotation isRefresh={isRefresh} setIsRefresh={setIsRefresh} />
      </View>

      <FlatList
        data={locationData}
        ListEmptyComponent={() => (
          <View className="items-center justify-center flex-1 mt-10">
            <Text className="text-lg font-semibold">Chưa có địa điểm nào được lưu</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableHighlight
            className="flex-row items-center gap-3 p-4 my-2 border border-gray-200 rounded-lg"
            onPress={() => router.push(`/(screens)/LocationDetailScreen/${item.id}`)}
            underlayColor="#f0f0f0"
          >
            <View className="flex-row items-center flex-1 gap-3">
              <Feather name="map-pin" size={20} className="p-2 bg-gray-200 rounded-full me-1" />
              <View className="justify-center flex-1 gap-1">
                <Text className="text-lg font-bold" numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Text>
                <Text>Bán kính {item.radius}m</Text>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  Kinh độ {item.lng} - Vĩ độ {item.lat}
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color="black" />
            </View>
          </TouchableHighlight>
        )}
        refreshing={isLoading && isFocused}
        onRefresh={() => setIsRefresh(true)}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchNextPage()}
        ListFooterComponent={() => (
          <>
            {isLoading ||
              (isFetchingNextPage && <Text className="text-center">Loading more...</Text>)}
          </>
        )}
      />
      <TouchableWithoutFeedback onPress={() => router.push('/(screens)/MapScreen')}>
        <View className="absolute p-4 bg-gray-700 rounded-full bottom-28 right-10">
          <Feather name="plus" size={24} color="white" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Location;
