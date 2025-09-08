import { copy } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function Index() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<{
    street: string;
    district: string;
    city: string;
  } | null>(null);
  const [time, setTime] = useState<string>('');
  const [triggerLocation, setTriggerLocation] = useState({
    loading: false,
    isTriggered: false,
  });

  const rotation = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    console.log('Requesting location permission...');

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          let addr = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          if (addr.length > 0) {
            const currentAddress = addr[0];
            setAddress({
              street: currentAddress.name || '',
              district: currentAddress.district || '',
              city: currentAddress.city || '',
            });
          }
        },
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [triggerLocation.isTriggered]);

  useEffect(() => {
    rotation.value = triggerLocation.loading ? withTiming(360, { duration: 1000 }) : 0;
  }, [triggerLocation.loading]);

  const handleRefreshLocation = () => {
    setTriggerLocation({ loading: true, isTriggered: true });
    setTimeout(() => setTriggerLocation({ loading: false, isTriggered: false }), 1000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="gap-2 p-4 border border-gray-700 rounded-xl">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="calendar-clock-outline" size={18} />
          {time && <Text className="font-semibold">{time}</Text>}
        </View>
        <TouchableWithoutFeedback
          onPress={() =>
            copy(`
               Địa chỉ: ${address?.street} ${address?.district} ${address?.city}
               Vĩ độ: ${location?.latitude}
               Kinh độ: ${location?.longitude}`)
          }
        >
          <View className="flex-row items-center gap-2">
            <Feather name="map-pin" size={18} />
            {location && (
              <Text className="font-semibold">
                {`${address?.street && `${address?.street} ,`} ${address?.district && `${address?.district} ,`} `}
                {address?.city} ({location.latitude.toFixed(2)}, {location.longitude.toFixed(2)})
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="gps-fixed" size={18} />
          <Text className="bg-gray-700 w-28 p-2 rounded-full text-white text-[12px] text-center">
            chính xác 10m
          </Text>
        </View>
        <Link href="/(screens)/Map" asChild>
          <TouchableOpacity className="flex-row justify-center gap-2 p-3 mt-4 bg-gray-200 rounded-lg">
            <Feather name="plus" size={24} color="black" />
            <Text className="text-xl font-semibold">Tạo địa điểm</Text>
          </TouchableOpacity>
        </Link>
        <TouchableWithoutFeedback
          onPress={handleRefreshLocation}
          disabled={triggerLocation.loading}
        >
          <Animated.View style={[animatedStyle, { position: 'absolute', right: 8, top: 8 }]}>
            <FontAwesome6 name="arrows-rotate" size={24} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
