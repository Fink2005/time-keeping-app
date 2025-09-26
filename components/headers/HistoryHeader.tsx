import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HistoryHeaderProps {
  onYearChange?: (year: number) => void;
  initialYear?: number;
  minYear?: number;
  maxYear?: number;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  onYearChange,
  initialYear = new Date().getFullYear(),
  minYear = 2020,
  maxYear = new Date().getFullYear(),
}) => {
  const [currentYear, setCurrentYear] = useState(initialYear);

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
    onYearChange?.(newYear);
  };

  const goToPreviousYear = () => {
    if (currentYear > minYear) {
      handleYearChange(currentYear - 1);
    }
  };

  const goToNextYear = () => {
    if (currentYear < maxYear) {
      handleYearChange(currentYear + 1);
    }
  };

  const isPreviousDisabled = currentYear <= minYear;
  const isNextDisabled = currentYear >= maxYear;

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

          <Text className="text-2xl font-bold min-w-[80px] text-center">{currentYear}</Text>

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
