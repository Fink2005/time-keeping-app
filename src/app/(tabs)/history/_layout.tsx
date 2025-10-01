import HistoryHeader from '@/components/headers/HistoryHeader';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HistoryHeader />,
        }}
      />
    </Stack>
  );
};

export default Layout;
