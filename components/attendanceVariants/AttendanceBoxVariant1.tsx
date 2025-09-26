import { AttendanceRes } from '@/types/Attendance';
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
  isFetchingNextPage: boolean;
};
const AttendanceBoxVariant1 = ({ data, fetchNextPage, isLoading, isFetchingNextPage }: Props) => {
  const isFocused = useIsFocused();

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 my-2 border border-gray-200 rounded-lg">
            <View className="gap-1">
              <View className="flex-row items-center justify-between w-full gap-2 mb-1">
                <Text
                  className={`w-24 px-2 py-1 text-center text-white rounded-full ${item.type === 'CHECK_OUT' ? 'bg-orange-500' : 'bg-blue-500'}`}
                >
                  {item.type === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
                </Text>
                <Text className="text-base font-medium text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text>Kinh độ: {item.lng}</Text>
              <Text>Vĩ độ: {item.lat}</Text>
              <Text numberOfLines={2}>Địa chỉ: {item.address}</Text>
            </View>
            <View className="items-end flex-1">
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} className="rounded-lg size-10" />
              )}
            </View>
          </View>
        )}
        refreshing={isLoading && isFocused}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 mt-10">
            <Text>Không có dữ liệu</Text>
          </View>
        }
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

export default AttendanceBoxVariant1;
