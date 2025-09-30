import Header from '@/components/headers/Header';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Quản lý tài khoản" isDisplayUserInfo />,
        }}
      />
    </Stack>
  );
};

export default Layout;
