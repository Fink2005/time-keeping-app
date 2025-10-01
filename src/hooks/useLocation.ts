/* eslint-disable no-console */
import locationRequest from '@/services/request/location';
import { CHECK_IN_OUT_TASK } from '@/tasks/autoCheckInOutTask';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

const useLocation = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEnabledAutoCheckInOut, setIsEnabledAutoCheckInOut] = useState(false);
  const isAllowed = useRef(false);
  const [address, setAddress] = useState<string | null>(null);

  const [locationInfo, setLocationInfo] = useState({
    latitude: 0,
    longitude: 0,
    isSuccess: false,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      if (!isAllowed.current) {
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
          Alert.alert('Permission for notifications not granted!');
        }

        // Request location permission based on OS
        let locationStatus;
        if (Platform.OS === 'ios') {
          // iOS foreground
          const fg = await Location.requestForegroundPermissionsAsync();
          // iOS background
          const bg = await Location.requestBackgroundPermissionsAsync();
          locationStatus = bg.status === 'granted' ? 'granted' : fg.status;
        } else {
          // Android foreground
          const fg = await Location.requestForegroundPermissionsAsync();
          locationStatus = fg.status;

          const bg = await Location.requestBackgroundPermissionsAsync();
          if (bg.status !== 'granted') {
            console.log('Background location not granted (Android)');
          }
        }

        if (locationStatus !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        console.log('Permission to access location granted');
        isAllowed.current = true;
      }

      // Watch position when permission granted
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          setLocationInfo({
            isSuccess: true,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          let addr = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          if (addr.length > 0) {
            const { name, district, city } = addr[0];
            setAddress(`${name || '_'} , ${district || '_'} , ${city || '_'}`);
          }
        },
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isRefresh]);

  // Geofencing for auto check in/out
  useEffect(() => {
    (async () => {
      if (!isEnabledAutoCheckInOut) return;

      console.log('Enable auto check in/out');

      // Background permission
      await Location.requestBackgroundPermissionsAsync();

      const myDestination = await locationRequest.getLocation(1);
      const regions = myDestination?.data?.map(({ name, lat, lng, radius }) => ({
        identifier: name,
        latitude: +lat,
        longitude: +lng,
        radius: +radius,
        notifyOnEnter: true,
        notifyOnExit: true,
      }));

      if (!regions?.length) return;

      await Location.startGeofencingAsync(CHECK_IN_OUT_TASK, regions);
    })();
  }, [isEnabledAutoCheckInOut]);

  return {
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
    address,
    isRefresh,
    setIsRefresh,
    setIsEnabledAutoCheckInOut,
    isEnabledAutoCheckInOut,
    isSuccess: locationInfo.isSuccess,
  };
};

export default useLocation;
