import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { View } from 'react-native';

const Setting = () => {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Feather name="settings" size={20} />
    </View>
  );
};

export default Setting;
