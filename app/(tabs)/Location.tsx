import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { View } from 'react-native';

const Location = () => {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Feather name="map-pin" size={20} />
    </View>
  );
};

export default Location;
