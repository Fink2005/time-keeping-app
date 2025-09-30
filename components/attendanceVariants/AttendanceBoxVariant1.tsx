import { AttendanceRes } from '@/types/attendance';
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
const AttendanceBoxVariant1 = ({
  data,
  fetchNextPage,
  isLoading,
  isRefetching,
  isFetchingNextPage,
}: Props) => {
  const isFocused = useIsFocused();
  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="items-center p-4 my-2 border border-blue-300 rounded-xl bg-blue-100/30">
            <View className="flex-row items-center justify-between w-full gap-2 pb-3 mb-1 border-b border-gray-200">
              <Text
                className={`w-24 px-2 py-1 text-center text-white rounded-full ${item.type === 'CHECK_OUT' ? 'bg-orange-500' : 'bg-blue-500'}`}
              >
                {item.type === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
              </Text>
              <Text className="text-base font-medium text-center text-red-500">
                {item.Location?.name}
              </Text>
            </View>
            <View className="flex-row w-full py-3">
              <View className="gap-1">
                <Text>Kinh độ: {item.lng}</Text>
                <Text>Vĩ độ: {item.lat}</Text>
                {item.note && <Text numberOfLines={1}>Ghi chú: {item.note}</Text>}
                <Text numberOfLines={2}>Địa chỉ: {item.address}</Text>
              </View>
              <View className="items-end justify-center flex-1 ">
                {item.imageUri && (
                  <Image source={{ uri: item.imageUri }} className="rounded-lg size-10" />
                )}
              </View>
            </View>
            <Text className="w-full pt-2 mt-2 text-base font-medium text-center text-blue-500 border-t border-gray-200">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        refreshing={(isLoading && isFocused) || isRefetching}
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
