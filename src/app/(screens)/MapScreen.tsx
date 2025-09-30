import Map from '@/src/components/Map';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

const MapScreen = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<number | undefined>();

  return (
    <View className="flex-1 bg-white">
      <View
        className={`${isSearching ? 'hidden' : ''} bg-gray-100 h-[170px] justify-center p-5 rounded-xl`}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          className="gap-4 p-5 bg-white rounded-xl"
        >
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#54585f"
            className="h-12 font-medium border border-gray-300 rounded-lg ps-3"
            placeholder="Nhập địa điểm"
          />
          <View className="flex-row items-center gap-2">
            <TextInput
              value={radius?.toString()}
              onChangeText={(text) => setRadius(Number(text))}
              placeholderTextColor="#54585f"
              className="flex-1 h-12 font-medium border border-gray-300 rounded-lg ps-3"
              placeholder="Nhập bán kính"
              keyboardType="number-pad" // khác numeric
              returnKeyType="done" // thêm nút Done trên iOS
            />

            <Text className="text-[#54585f]">mét</Text>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Map
        onSearch={setIsSearching}
        isSearching={isSearching}
        location={location}
        radius={radius}
      />
    </View>
  );
};

export default MapScreen;
