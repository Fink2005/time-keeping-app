import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Time = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View className="flex-row items-center gap-2 bg-blue-500 p-4 h-16">
      <Feather name="calendar" size={18} color="white" />
      {time && <Text className="font-semibold text-white">{time}</Text>}
    </View>
  );
};

export default Time;
