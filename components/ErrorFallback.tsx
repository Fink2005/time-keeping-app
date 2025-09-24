// components/ErrorFallback.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ErrorFallback({ reset, error }: any) {
  return (
    <View className="items-center justify-center flex-1 p-6 bg-red-50">
      <Text className="mb-2 text-2xl font-bold text-red-600">Oops! 😢</Text>
      <Text className="px-4 mb-4 text-center text-gray-700">{String(error)}</Text>
      <TouchableOpacity onPress={reset} className="px-6 py-3 bg-red-500 shadow-md rounded-xl">
        <Text className="font-semibold text-white">Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
