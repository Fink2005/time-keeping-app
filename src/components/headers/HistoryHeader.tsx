import { useAuthStore } from '@/store/useAuthStore';
import { useCommonStore } from '@/store/useCommonStore';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryHeader = () => {
  const { userInfo } = useAuthStore();

  const createdYear = userInfo
    ? new Date(userInfo.createdAt).getFullYear()
    : new Date().getFullYear();
  const year = useCommonStore((state) => state.year);
  const setYear = useCommonStore((state) => state.setYear);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  const goToPreviousYear = () => {
    if (year > createdYear) {
      handleYearChange(year - 1);
    }
  };

  const goToNextYear = () => {
    if (year < new Date().getFullYear()) {
      handleYearChange(year + 1);
    }
  };

  const isPreviousDisabled = year <= createdYear;
  const isNextDisabled = year >= new Date().getFullYear();

  return (
    <>
      <SafeAreaView
        edges={['top']}
        className="flex-row items-center justify-end pb-2 text-center bg-white pe-5"
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={goToPreviousYear}
            disabled={isPreviousDisabled}
            className={`p-2 border rounded-full ${
              isPreviousDisabled ? 'border-gray-100 opacity-30' : 'border-gray-200'
            }`}
          >
            <Feather
              name="chevron-left"
              size={16}
              color={isPreviousDisabled ? '#d1d5db' : 'black'}
            />
          </Pressable>

          <Text className="text-2xl font-bold min-w-[80px] text-center">{year}</Text>

          <Pressable
            onPress={goToNextYear}
            disabled={isNextDisabled}
            className={`p-2 border rounded-full ${
              isNextDisabled ? 'border-gray-100 opacity-30' : 'border-gray-200'
            }`}
          >
            <Feather name="chevron-right" size={16} color={isNextDisabled ? '#d1d5db' : 'black'} />
          </Pressable>
        </View>
      </SafeAreaView>
      <View className="border-b border-gray-200 "></View>
    </>
  );
};

export default HistoryHeader;
