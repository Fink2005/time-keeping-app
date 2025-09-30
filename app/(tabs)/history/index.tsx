import { useGetAttendanceByYear } from '@/services/queries/useAttendance';
import { useCommonStore } from '@/store/useCommonStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function History() {
  const year = useCommonStore((state) => state.year);

  const { data: attendanceData, isLoading, refetch } = useGetAttendanceByYear(year);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, year, refetch]);

  return (
    <View className="justify-center flex-1 bg-white">
      <FlatList
        data={attendanceData?.data || []}
        keyExtractor={(item) => item.month.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 5 }}
        renderItem={({ item }) => (
          <Link href={`/(screens)/CheckAttendanceDetailScreen/${year}-${item.initialDate}`} asChild>
            <Pressable className="flex-1 p-5 m-2 bg-white border border-gray-100 shadow-sm rounded-xl">
              <Text className="text-lg font-bold">Tháng {item.month}</Text>
              <View className="flex-row items-center gap-2 mt-2">
                <Feather name="check-circle" size={15} color="#286BD7" />
                <Text className="text-xs">Số lần check-in: {item.checkIn} lần</Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Feather name="check-circle" size={15} color="#f97316" />
                <Text className="text-xs">Số lần check-out: {item.checkOut} lần</Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Ionicons name="checkmark-done" size={15} color="#22c55e" />
                <Text className="text-xs">Tổng: {item.pairs} lần</Text>
              </View>
            </Pressable>
          </Link>
        )}
        refreshing={isLoading && isFocused}
        ListEmptyComponent={() => (
          <View className="items-center justify-center flex-1 mt-10">
            <Text>Không có dữ liệu</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
