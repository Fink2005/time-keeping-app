import Header from '@/src/components/headers/Header';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Vị trí hiện tại" isDisplayUserInfo />,
        }}
      />
    </Stack>
  );
};

export default Layout;
