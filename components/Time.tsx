import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
    <View className="flex-row items-center gap-2">
      <MaterialCommunityIcons name="calendar-clock-outline" size={18} />
      {time && <Text className="font-semibold">{time}</Text>}
    </View>
  );
};

export default Time;
