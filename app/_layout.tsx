import Header from '@/components/headers/Header';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          {/* Các screen con */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
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
            name="(screens)/CheckInOutWithImage"
            options={{
              header: () => <Header isDisplayPrevious title="Chấm công với camera" />,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
