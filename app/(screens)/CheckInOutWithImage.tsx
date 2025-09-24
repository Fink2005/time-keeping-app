/* eslint-disable no-console */
import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Alert,
  Button,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import useLocation from '@/hooks/useLocation';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckInOutWithImage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const router = useRouter();
  const { latitude, longitude, address } = useLocation();

  // Ask MediaLibrary permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Yêu cầu quyền',
            'Ứng dụng cần quyền Ảnh để hoạt động. Vui lòng bật trong Cài đặt.',
            [
              { text: 'Hủy', style: 'cancel', onPress: () => router.back() },
              { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
            ],
          );
          setHasMediaPermission(false);
          return;
        }
        setHasMediaPermission(true);
      } catch (err) {
        console.error('Media permission error:', err);
        setHasMediaPermission(false);
        router.back();
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync();
    if (result?.uri) {
      setPhoto(result.uri);
    }
  };

  const confirmToSavePhoto = async () => {
    if (!photo) return; // prevent crash

    try {
      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(photo);
      let album = await MediaLibrary.getAlbumAsync('Tira');
      if (!album) {
        await MediaLibrary.createAlbumAsync('Tira', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      // Attendance logic
      const [getAttendanceStorage, getAttendanceType] = await Promise.allSettled([
        getData('attendanceRecords'),
        getData('attendanceType'),
      ]);

      if (getAttendanceType.status === 'fulfilled') {
        const nextType = getAttendanceType.value === 'check-in' ? 'check-out' : 'check-in';
        await storeData('attendanceType', nextType);

        const locationStorage =
          getAttendanceStorage.status === 'fulfilled' ? getAttendanceStorage.value || [] : [];

        await storeData('attendanceRecords', [
          ...locationStorage,
          {
            id: uuidv4(),
            latitude,
            longitude,
            address: address || '',
            imageUri: photo,
            type: nextType,
            createdAt: new Date().toLocaleString(),
          },
        ]);

        showAlert(
          'Thành công',
          `Chấm công ${getAttendanceType.value === 'check-in' ? 'ra' : 'vào'} thành công`,
        );
      }

      setPhoto(null);
      router.back();
    } catch (err) {
      console.error('confirmToSavePhoto error:', err);
      showAlert('Lỗi', 'Không thể lưu ảnh hoặc ghi dữ liệu');
    }
  };

  // Handle permissions
  if (!permission || hasMediaPermission === null) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Đang kiểm tra quyền...</Text>
      </View>
    );
  }

  if (!permission.granted || !hasMediaPermission) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Không có quyền camera hoặc media library</Text>
        <Button title="Cấp quyền camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ flex: 1 }} />
      ) : (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      )}

      <View className="flex-row items-center justify-center h-24 px-4">
        {photo ? (
          <Pressable onPress={confirmToSavePhoto}>
            <FontAwesome
              name="check"
              size={24}
              color="white"
              className="p-5 bg-green-500 rounded-full"
            />
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}
              className="absolute left-16"
            >
              <FontAwesome name="rotate-left" size={40} color="black" />
            </Pressable>
            <TouchableHighlight onPress={takePhoto} className="p-5 bg-black rounded-full ">
              <Entypo name="camera" size={30} color="white" />
            </TouchableHighlight>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
