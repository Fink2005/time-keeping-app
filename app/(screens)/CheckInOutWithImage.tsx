import { getData, storeData } from '@/utils/asyncStorage';
import { showAlert } from '@/utils/global';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import useLocation from '@/hooks/useLocation';
import { Camera, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckInOutWithImage() {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const router = useRouter();
  const { latitude, longitude, address } = useLocation();

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  const confirmToSavePhoto = async () => {
    const asset = await MediaLibrary.createAssetAsync(photo!);
    let album = await MediaLibrary.getAlbumAsync('Tira');
    if (!album) {
      await MediaLibrary.createAlbumAsync('Tira', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    const [getAttendanceStorage, getAttendanceType] = await Promise.allSettled([
      getData('attendanceRecords'),
      getData('attendanceType'),
    ]);
    if (getAttendanceType.status === 'fulfilled') {
      await storeData(
        'attendanceType',
        getAttendanceType.value === 'check-in' ? 'check-out' : 'check-in',
      );

      const locationStorage =
        getAttendanceStorage.status === 'fulfilled' ? getAttendanceStorage.value || [] : [];
      await storeData('attendanceRecords', [
        ...locationStorage,
        {
          id: uuidv4(),
          latitude,
          longitude,
          address: address || '',
          imageUri: photo!,
          type: getAttendanceType.value === 'check-in' ? 'check-out' : 'check-in',
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
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Không có quyền camera hoặc media library</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
