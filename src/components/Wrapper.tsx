import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  Platform.OS === 'android' ? (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {children}
    </SafeAreaView>
  ) : (
    <>{children}</>
  );

export default Wrapper;
