import { useAttendance } from '@/services/queries/useAttendance';
import { FlatList, Image, Text, View } from 'react-native';

const HistoryAttendance = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useAttendance();

  const attendanceRecords = data?.pages.flatMap((page) => page.data) || [];

  if (!attendanceRecords?.length) {
    return;
  }
  return (
    <View className="flex-1 mt-4">
      <Text className="text-xl font-bold">Lịch sử gần đây</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={attendanceRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`${item.type === 'CHECK_IN' ? 'border-blue-400' : 'border-orange-500'} flex-row items-center p-4 my-2 border border-gray-200 rounded-lg`}
          >
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
        onEndReached={async () => await fetchNextPage()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => (
          <>
            {isLoading ||
              (isFetchingNextPage && <Text className="text-center">Loading more...</Text>)}
          </>
        )}
      />
    </View>
  );
};

export default HistoryAttendance;
