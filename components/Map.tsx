/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { DEFAULT_DELTA } from '@/constants/global';
import useDebounce from '@/hooks/useDebounce';
import useLocation from '@/hooks/useLocation';
import { useTanstackLocation } from '@/services/queries/useTanstackLocation';
import { showAlert } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import { reverseGeocodeAsync } from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import MapView, { Marker, UrlTile } from 'react-native-maps';

// Define type for API response
type Suggestion = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
  };
};

type Props = {
  isSearching: boolean;
  location: string;
  radius: number | undefined;
  onSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const Map = ({ isSearching, onSearch, location, radius }: Props) => {
  const { isSuccess, latitude, longitude } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { mutate: createLocation } = useTanstackLocation();

  const [address, setAddress] = useState<string>('');
  const debouncedAddress = useDebounce(address, 400);

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
      const data: Suggestion[] = await res.json();
      setSuggestions(data || []);
    } catch {
      showAlert('Error', 'Không thể tìm địa điểm. Vui lòng thử lại.');
    }
  };

  const fetchNearbySuggestions = async (text: string, centerLat: number, centerLon: number) => {
    try {
      const viewbox = `${centerLon - 0.05},${centerLat - 0.05},${centerLon + 0.05},${centerLat + 0.05}`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text,
        )}&format=json&addressdetails=1&limit=15&viewbox=${viewbox}&bounded=1`,
      );
      const data: Suggestion[] = await res.json();
      if (!data.length) {
        showAlert('Error', 'Không tìm thấy địa điểm , vui lòng sử dụng marker để chọn vị trí');
        return;
      }
      setSuggestions(data);
      mapRef.current?.animateToRegion(
        {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
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
    setAddress('');
  };

  const handleSelectLocation = (item: Suggestion) => {
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);

    setSelectedLocation({ latitude, longitude });
    onSearch(false);
    setAddress(item.display_name);

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
    setAddress(address?.[0]?.name || '');
  };

  const handleConfirm = async () => {
    if (!selectedLocation || !radius || !address) {
      showAlert('Error', 'Vui lòng nhập tên địa điểm, bán kính và vị trí');
      return;
    }

    createLocation({
      address,
      lat: selectedLocation.latitude.toString(),
      lng: selectedLocation.longitude.toString(),
      radius,
      name: location,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setSelectedLocation({ latitude, longitude });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (debouncedAddress) {
      fetchSuggestions(debouncedAddress);
    }
  }, [debouncedAddress]);

  if (!selectedLocation) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 overflow-hidden rounded-xl">
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
        </MapView>

        {/* Search bar overlay */}
        <View pointerEvents="box-none" className="absolute left-0 right-0 p-2">
          {isSearching ? (
            <TouchableWithoutFeedback onPress={() => handleReset()}>
              <View className="absolute z-10 left-6 top-[16px]">
                <Feather name="chevron-left" size={24} color="black" />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <Feather
              name="map-pin"
              size={24}
              color="#22c55e"
              style={{ position: 'absolute', left: 24, top: 16, zIndex: 10 }}
            />
          )}
          <TextInput
            onChangeText={(text) => setAddress(text)}
            onPressIn={() => onSearch(true)}
            placeholderTextColor="#54585f"
            placeholder="Tìm kiếm"
            onSubmitEditing={() => {
              if (suggestions.length > 0) {
                handleSelectLocation(suggestions[0]);
              } else {
                fetchNearbySuggestions(address, latitude, longitude);
              }
            }}
            editable={isSearching}
            value={address}
            className="w-full h-12 px-12 font-medium bg-white border border-gray-300 rounded-full"
          />
          {isSearching && (
            <TouchableWithoutFeedback onPress={() => handleReset(true)}>
              <View className="absolute z-10 right-6 top-[16px]">
                <Feather name="x-circle" size={24} color="black" />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

      {/* Suggestions list */}
      {isSearching && (
        <View
          className="absolute left-0 right-0 z-30 pb-52 top-16"
          style={{ maxHeight: screenHeight }}
        >
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => handleSelectLocation(item)}>
                <View className="p-4 bg-white border-b border-gray-200">
                  <Text className="font-medium">{item.display_name}</Text>
                  {(item.address.city || item.address.town || item.address.village) && (
                    <Text className="text-sm text-gray-500">
                      {item.address.city || item.address.town || item.address.village}
                    </Text>
                  )}
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      )}

      {/* Buttons */}
      {!isSearching && (
        <View className="absolute left-0 right-0 z-50 flex-row items-center justify-between h-20 gap-2 p-4 bottom-6">
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
      )}
    </>
  );
};

export default Map;
