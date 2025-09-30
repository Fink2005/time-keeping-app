import { useAuthStore } from '@/store/useAuthStore';
import { formatName } from '@/utils/global';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  isDisplayUserInfo?: boolean;
  isDisplayPrevious?: boolean;
};

const Header = ({ title, isDisplayUserInfo, isDisplayPrevious }: Props) => {
  const router = useRouter();
  const { userInfo } = useAuthStore();

  return (
    <>
      <SafeAreaView edges={['top']} className="px-4 bg-white">
        <View className="flex-row items-center justify-between w-full pb-2">
          {/* Left: Back button */}
          <Pressable onPress={router.back} className={isDisplayPrevious ? '' : 'opacity-0'}>
            <Feather name="chevron-left" size={26} color="black" />
          </Pressable>

          {/* Center: Title */}
          <Text className="flex-1 text-lg font-bold text-center text-black">{title}</Text>

          {/* Right: User info */}
          <View
            className={
              'flex-row items-center justify-center gap-4 size-[32px] bg-[#03897B] rounded-full' +
              (isDisplayUserInfo ? '' : ' opacity-0')
            }
          >
            {userInfo && userInfo.name && (
              <Text className="font-medium text-white">{formatName(userInfo.name)}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom border */}
      <View className="border-b border-gray-200" />
    </>
  );
};

export default Header;
