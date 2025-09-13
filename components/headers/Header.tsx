import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = {
  title?: string;
  isDisplayUserInfo?: boolean;
  isDisplayPrevious?: boolean;
};
const Header = ({ title, isDisplayUserInfo, isDisplayPrevious }: Props) => {
  const router = useRouter();
  return (
    <>
      <SafeAreaView edges={['top']} className="px-4 bg-white">
        <View className="flex-row items-center justify-between w-full pb-2">
          <Pressable onPress={router.back}>
            <Feather
              name="chevron-left"
              size={24}
              color="black"
              className={`${isDisplayPrevious ? '' : 'opacity-0'}`}
            />
          </Pressable>
          <Text className="absolute text-lg font-bold text-black -translate-x-1/2 left-1/2 top-1">
            {title}
          </Text>
          <View className={'flex-row items-center gap-4 ' + (isDisplayUserInfo ? '' : 'opacity-0')}>
            <Feather name="bell" size={24} color="black" />
            <Image
              source={{
                uri: 'https://scontent.fvca5-1.fna.fbcdn.net/v/t39.30808-6/476422457_1718274842234989_7706556519784394129_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE9SN714H3hXF1Qf1gZFlpmEUkjYWnB3OARSSNhacHc4MAHqXWffAHksbGcaH4binBYkCoxrCrfhVs0na0VB2iO&_nc_ohc=U2X4vJzw0isQ7kNvwFqX_LO&_nc_oc=AdnoPqlUWeHBa-2IgB09vwJnz8XQVVWgJyCDt1noIEYtLcIjbukUGVbZz2n-sBGHxOe6mi270p9Qb_L2YCpX3WYt&_nc_zt=23&_nc_ht=scontent.fvca5-1.fna&_nc_gid=qMC-enRXNrbHZf3U4JSHAQ&oh=00_AfaTAXK9CesipLoORefIBfZJ1tK2xXWYpDp1rx5T1l1Mmg&oe=68C45CF0',
              }}
              style={{ width: 32, height: 32, borderRadius: 15 }}
            />
          </View>
        </View>
      </SafeAreaView>
      <View className="border-b border-gray-200 "></View>
    </>
  );
};

export default Header;
