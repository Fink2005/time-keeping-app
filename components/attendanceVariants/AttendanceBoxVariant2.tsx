import { AttendanceRes } from '@/types/Attendance';
import { formatDate } from '@/utils/global';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

type Props = {
  data: AttendanceRes['data'];
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<AttendanceRes, unknown>, Error>>;
  isLoading: boolean;
  isRefetching?: boolean;
  isFetchingNextPage: boolean;
};
const AttendanceBoxVariant2 = ({
  data,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
  isRefetching,
}: Props) => {
  const isFocused = useIsFocused();

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 my-2 border border-gray-200 rounded-lg">
            <View className="gap-2">
              <View className="flex-row items-center justify-between w-full mb-1">
                <View className="flex-row items-center gap-2">
                  <Feather name="clock" size={22} color="#3b82f6" />
                  <Text className="text-xl font-semibold">
                    {formatDate(item.createdAt, 'daily')}
                  </Text>
                </View>
                <Text
                  className={`w-24 px-2 py-1 text-center text-white rounded-full ${item.type === 'CHECK_OUT' ? 'bg-orange-500' : 'bg-blue-500'}`}
                >
                  {item.type === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Feather name="map-pin" size={16} color="#3b82f6" />
                <Text numberOfLines={2}>{item.address}</Text>
              </View>
            </View>
            <View className="items-end flex-1">
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} className="rounded-lg size-10" />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 mt-10">
            <Text>Không có dữ liệu</Text>
          </View>
        }
        refreshing={(isLoading && isFocused) || isRefetching}
        onEndReached={async () => await fetchNextPage()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => (
          <>
            {isLoading ||
              (isFetchingNextPage && <Text className="text-center">Loading more...</Text>)}
          </>
        )}
      />
    </>
  );
};

export default AttendanceBoxVariant2;
