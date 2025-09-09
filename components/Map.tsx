import { DEFAULT_DELTA } from '@/constants/global';
import useDebounce from '@/hooks/useDebounce';
import useMap from '@/hooks/useMap';
import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import log from '@/utils/logger';
import Feather from '@expo/vector-icons/Feather';
import { reverseGeocodeAsync } from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, TextInput, TouchableHighlight, View } from 'react-native';
import 'react-native-get-random-values';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { v4 as uuidv4 } from 'uuid';
type Props = {
  isSearching: boolean;
  location: string;
  radius: string;
  onSearch: React.Dispatch<React.SetStateAction<boolean>>;
};
const Map = ({ isSearching, onSearch, location, radius }: Props) => {
  const { isSuccess, latitude, longitude } = useMap();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 400);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const mapRef = useRef<MapView>(null);

  const { height: screenHeight } = Dimensions.get('window');
  const router = useRouter();

  const fetchSuggestions = async (text: string) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text,
        )}&format=json&addressdetails=1&limit=15&countrycodes=vn`,
      );
      const data = await res.json();
      console.log('data', data);
      if (!data.length) {
        setSuggestions([]);
        return;
      }
      log(data);
      setSuggestions(data);
    } catch {
      showAlert('Error', 'Không thể tìm địa điểm. Vui lòng thử lại.');
    }
  };

  const fetchNearbySuggestions = async (text: string, centerLat: number, centerLon: number) => {
    try {
      const viewbox = `${centerLon - 0.05},${centerLat - 0.05},${centerLon + 0.05},${centerLat + 0.05}`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=15&viewbox=${viewbox}&bounded=1`,
      );
      const data = await res.json();
      if (!data.length) {
        showAlert('Error', 'Không tìm thấy địa điểm , vui lòng sử dụng marker để chọn vị trí');
        return;
      }
      setSuggestions(data[0]);
      mapRef.current?.animateToRegion(
        {
          latitude: data[0].lat,
          longitude: data[0].lon,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        },
        500,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = (isCancel?: boolean) => {
    !isCancel && onSearch(false);
    setSuggestions([]);
    setQuery('');
  };

  const handleSelectLocation = (item: any) => {
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);

    setSelectedLocation({ latitude, longitude });
    onSearch(false);
    setQuery(item.display_name);

    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: DEFAULT_DELTA, longitudeDelta: DEFAULT_DELTA },
      500,
    );
  };
  const handleDragMarker = async (coordinate: { latitude: number; longitude: number }) => {
    const address = await reverseGeocodeAsync({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    setQuery(address ? address[0].name || '' : '');
  };

  const handleConfirm = async () => {
    if (!location || !radius || !query || !selectedLocation) {
      showAlert('Error', 'Vui lòng nhập tên địa điểm, bán kính và vị trí');
      return;
    }
    const myLocationData = await getData('myLocation');

    const data = [
      ...(myLocationData || []),
      {
        id: uuidv4(),
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
        address: query,
        location,
        radius,
        createdAt: new Date().toLocaleString(),
      },
    ];

    try {
      await storeData('myLocation', data);
      showAlert('Success', 'Lưu địa điểm thành công');
      router.push('/(tabs)/Location');
    } catch (error) {
      showAlert('Error', 'Lưu địa điểm thất bại');
      log('Error saving location:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSelectedLocation({
        latitude,
        longitude,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery]);

  if (!selectedLocation) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }
  return (
    <>
      <MapView
        mapType="hybrid"
        showsCompass={false}
        ref={mapRef}
        style={{ flex: 1, borderRadius: 15 }}
        region={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        }}
      >
        <UrlTile
          urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/positron/{z}/{x}/{y}{r}.png"
          maximumZ={19}
        />
        <Marker
          draggable
          coordinate={selectedLocation}
          pointerEvents="box-none"
          onDragEnd={(e) => {
            handleDragMarker(e.nativeEvent.coordinate);
          }}
        />

        {/* Search bar overlay */}
        <View pointerEvents="box-none" className="absolute top-0 left-0 right-0 p-2">
          {isSearching ? (
            <Feather
              name="chevron-left"
              size={24}
              color="black"
              onPress={() => handleReset()}
              className="absolute z-10 left-6 top-[16px]"
            />
          ) : (
            <Feather
              name="map-pin"
              size={24}
              color="#22c55e"
              className="absolute z-10 left-6 top-[16px]"
            />
          )}
          <TextInput
            onChangeText={(text) => setQuery(text)}
            onPress={() => onSearch(true)}
            placeholderTextColor="#54585f"
            placeholder="Tìm kiếm"
            onSubmitEditing={() => {
              if (suggestions?.length > 0) {
                handleSelectLocation(suggestions[0]);
              } else {
                // không có suggestion → fetch nearby
                fetchNearbySuggestions(query, latitude, longitude);
              }
            }}
            readOnly={!isSearching}
            value={query}
            className="w-full h-12 px-12 font-medium bg-white border border-gray-300 rounded-full"
          />
          {isSearching && (
            <Feather
              name="x-circle"
              size={24}
              color="black"
              onPress={() => handleReset(true)}
              className="absolute z-10 right-6 top-[16px]"
            />
          )}
        </View>
      </MapView>

      {/* Suggestions list */}
      {isSearching && (
        <View
          className="absolute left-0 right-0 z-50 pb-52 top-16 "
          style={{ maxHeight: screenHeight }}
        >
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => handleSelectLocation(item)}>
                <View className="p-4 bg-white border-b border-gray-200">
                  <Text className="font-medium">{item.display_name}</Text>
                  {item.address.city && (
                    <Text className="text-sm text-gray-500">{item.address.city}</Text>
                  )}
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      )}

      {/* Buttons */}
      <View
        className={`absolute left-0 right-0 z-50 flex-row items-center justify-between h-20 gap-2 p-4 -translate-x-1 border-gray-200 bottom-6 ${isSearching ? 'hidden' : ''}`}
      >
        <TouchableHighlight
          underlayColor="#f0f0f0"
          className="items-center justify-center w-1/2 h-full bg-white rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="font-medium text-black">Hủy</Text>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="#86efac"
          className="items-center justify-center w-1/2 h-full bg-green-500 rounded-lg"
          onPress={handleConfirm}
        >
          <Text className="font-medium text-white">Xác nhận</Text>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default Map;
