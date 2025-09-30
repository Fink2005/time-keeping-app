/* eslint-disable no-console */
// import { CHECK_IN_OUT_TASK } from '@/tasks/autoCheckInOutTask';
// import { getData } from '@/utils/asyncStorage';
import locationRequest from '@/src/services/request/location';
import { CHECK_IN_OUT_TASK } from '@/tasks/autoCheckInOutTask';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

const useLocation = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEnabledAutoCheckInOut, setIsEnabledAutoCheckInOut] = useState(false);
  const isAllowed = useRef(false);
  const [address, setAddress] = useState<string | null>(null);

  const [locationInfo, setlocationInfo] = useState({
    latitude: 0,
    longitude: 0,
    isSuccess: false,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      if (!isAllowed.current) {
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
          alert('Permission for notifications not granted!');
        }
        if (locationStatus !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        console.log('Permission to access location granted');
        isAllowed.current = true;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          setlocationInfo((prev) => ({
            ...prev,
            isSuccess: true,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }));

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

  useEffect(() => {
    (async () => {
      if (!isEnabledAutoCheckInOut) return;
      console.log('Enable auto check in/out');
      await Location.requestBackgroundPermissionsAsync();

      const myDestination = await locationRequest.getLocation(1);
      const regions = myDestination!.data.map(({ name, lat, lng, radius }) => {
        return {
          identifier: name,
          latitude: +lat,
          longitude: +lng,
          radius: +radius,
          notifyOnEnter: true,
          notifyOnExit: true,
        };
      });

      if (!regions.length) {
        return;
      }

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
