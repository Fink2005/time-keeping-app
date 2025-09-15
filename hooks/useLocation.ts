/* eslint-disable no-console */
import { CHECK_IN_OUT_TASK } from '@/tasks/autoCheckInOutTask';
import { AttendanceBase } from '@/types/Attendance';
import { getData } from '@/utils/asyncStorage';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

const useLocation = () => {
  const [isRefresh, setIsRefresh] = useState(false);

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
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
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
      await Location.requestBackgroundPermissionsAsync();
      const myDestination: AttendanceBase[] | null = (await getData('myDestination')) || null;
      console.log('myDestination for geofencing:', myDestination);
      if (!myDestination || myDestination.length === 0) return;
      const regions = myDestination.map(({ destination, latitude, longitude, radius }) => {
        return {
          identifier: destination,
          latitude,
          longitude,
          radius: +radius,
          notifyOnEnter: true,
          notifyOnExit: true,
        };
      });

      await Location.startGeofencingAsync(CHECK_IN_OUT_TASK, regions);
    })();
  }, [isRefresh]);

  return {
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
    address,
    isRefresh,
    setIsRefresh,
    isSuccess: locationInfo.isSuccess,
  };
};

export default useLocation;
