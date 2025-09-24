import ErrorBoundary from '@/app/(screens)/ErrorBoundaryScreen';
import ErrorFallback from '@/components/ErrorFallback';
import Header from '@/components/headers/Header';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ErrorBoundary
          fallback={(reset: any, error: any) => <ErrorFallback reset={reset} error={error} />}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(screens)/MapScreen"
              options={{
                header: () => <Header title="Thêm địa điểm mới" />,
              }}
            />
            <Stack.Screen
              name="(screens)/LocationDetailScreen/[locationId]"
              options={{
                header: () => <Header isDisplayPrevious title="Chi tiết địa điểm" />,
              }}
            />
            <Stack.Screen
              name="(screens)/CheckAttendanceDetail/[attendanceDetailId]"
              options={{
                header: () => (
                  <Header isDisplayPrevious isDisplayUserInfo title="Chi tiết chấm công" />
                ),
              }}
            />
            <Stack.Screen
              name="(screens)/CheckInOutWithImage"
              options={{
                header: () => <Header isDisplayPrevious title="Chấm công với camera" />,
              }}
            />
            <Stack.Screen name="(screens)/ErrorBoundaryScreen" />
          </Stack>
        </ErrorBoundary>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
