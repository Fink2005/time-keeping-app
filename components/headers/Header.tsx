import { useAuthStore } from '@/store/useAuthStore';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  isDisplayUserInfo?: boolean;
  isDisplayYear?: boolean;
  isDisplayPrevious?: boolean;
};
const Header = ({ title, isDisplayUserInfo, isDisplayYear, isDisplayPrevious }: Props) => {
  const router = useRouter();
  const { userInfo } = useAuthStore();
  return (
    <>
      <SafeAreaView edges={['top']} className="px-4 bg-white">
        <View className="flex-row items-center justify-between w-full pb-2">
          <Pressable onPress={router.back}>
            <Feather
              name="chevron-left"
              size={26}
              color="black"
              className={`${isDisplayPrevious ? '' : 'opacity-0'}`}
            />
          </Pressable>
          <Text className="absolute text-lg font-bold text-black -translate-x-1/2 left-1/2 top-1">
            {title}
          </Text>
          <View className={'flex-row items-center gap-4 ' + (isDisplayUserInfo ? '' : 'opacity-0')}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${userInfo?.name}&background=random&color=0098F0`,
              }}
              className="size-[32px] rounded-[15px]"
            />
          </View>
          {isDisplayYear && (
            <View className="flex-row items-center justify-center gap-5 text-center">
              <Pressable
                onPress={router.back}
                className="p-2 mr-4 border border-gray-200 rounded-full"
              >
                <Feather name="chevron-left" size={20} color="black" />
              </Pressable>
              <Text className="text-2xl font-bold ">2025</Text>
              <Pressable
                onPress={router.back}
                className="p-2 ml-4 border border-gray-200 rounded-full"
              >
                <Feather name="chevron-right" size={20} color="black" />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
      <View className="border-b border-gray-200 "></View>
    </>
  );
};

export default Header;
