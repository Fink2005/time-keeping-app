import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function History() {
  const currentDay = String(new Date().getDate()).padStart(2, '0');
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  const data = [
    { month: 'Tháng 1', count: 20, value: `2025-01-${currentMonth === '01' ? currentDay : '01'}` },
    {
      month: 'Tháng 2',
      count: 19,
      value: `2025-02-${currentMonth === '02' ? currentDay : '01'}`,
    },
    {
      month: 'Tháng 3',
      count: 17,
      value: `2025-03-${currentMonth === '03' ? currentDay : '01'}`,
    },
    { month: 'Tháng 4', count: 5, value: `2025-04-${currentMonth === '04' ? currentDay : '01'}` },
    { month: 'Tháng 5', count: 5, value: `2025-05-${currentMonth === '05' ? currentDay : '01'}` },
    { month: 'Tháng 6', count: 5, value: `2025-06-${currentMonth === '06' ? currentDay : '01'}` },
    { month: 'Tháng 7', count: 5, value: `2025-07-${currentMonth === '07' ? currentDay : '01'}` },
    { month: 'Tháng 8', count: 5, value: `2025-08-${currentMonth === '08' ? currentDay : '01'}` },
    { month: 'Tháng 9', count: 5, value: `2025-09-${currentMonth === '09' ? currentDay : '01'}` },
    {
      month: 'Tháng 10',
      count: 5,
      value: `2025-10-${currentMonth === '10' ? currentDay : '01'}`,
    },
    {
      month: 'Tháng 11',
      count: 5,
      value: `2025-11-${currentMonth === '11' ? currentDay : '01'}`,
    },
    {
      month: 'Tháng 12',
      count: 5,
      value: `2025-12-${currentMonth === '12' ? currentDay : '01'}`,
    },
  ];
  return (
    <View className="justify-center flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.month.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 5 }}
        renderItem={({ item }) => (
          <Link href={`/(screens)/CheckAttendanceDetail/${item.value}`} asChild>
            <Pressable className="flex-1 p-5 m-2 bg-white border border-gray-100 shadow-sm rounded-xl">
              <Text className="text-lg font-bold">{item.month}</Text>
              <View className="flex-row items-center gap-2 mt-2">
                <Feather name="check-circle" size={15} color="#286BD7" />
                <Text className="text-xs">Số lần checkin {item.count} lần</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
