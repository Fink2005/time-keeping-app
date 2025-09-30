import { AttendanceRes } from '@/types/attendance';
import { formatDate } from '@/utils/global';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
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
              <View className="flex-row items-center justify-between w-full pb-2 mb-1 border-b border-gray-200">
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
              <View className="flex-row items-center justify-between">
                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <Feather name="map-pin" size={16} color="#3b82f6" />
                    <Text numberOfLines={2}>{item.address}</Text>
                  </View>
                  {item.note && (
                    <View className="flex-row items-center w-2/3 gap-2">
                      <FontAwesome5 name="pen" size={14} color="#22c55e" />
                      <Text numberOfLines={1}>{item.note}</Text>
                    </View>
                  )}
                </View>
                {item.imageUri && (
                  <Image source={{ uri: item.imageUri }} className="rounded-lg size-10" />
                )}
              </View>
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
