import Header from '@/components/headers/Header';
import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      {/* Các screen con */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(screens)/Map"
        options={{
          header: () => <Header title="Thêm địa điểm mới" />,
        }}
      />
    </Stack>
  );
}
