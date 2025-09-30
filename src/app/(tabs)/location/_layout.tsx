import Header from '@/src/components/headers/Header';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Địa điểm đã lưu" />,
        }}
      />
    </Stack>
  );
};

export default Layout;
