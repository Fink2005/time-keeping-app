import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

const data = [
  { month: 'Tháng 1', count: 20 },
  { month: 'Tháng 2', count: 19 },
  { month: 'Tháng 3', count: 17 },
  { month: 'Tháng 4', count: 5 },
  { month: 'Tháng 5', count: 5 },
  { month: 'Tháng 6', count: 5 },
  { month: 'Tháng 7', count: 5 },
  { month: 'Tháng 8', count: 5 },
  { month: 'Tháng 9', count: 5 },
  { month: 'Tháng 10', count: 5 },
  { month: 'Tháng 11', count: 5 },
  { month: 'Tháng 12', count: 5 },
];

export default function History() {
  return (
    <View className="justify-center flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.month.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 5 }}
        renderItem={({ item }) => (
          <Link href={`/(screens)/CheckAttendanceDetail/${item.month}`} asChild>
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
