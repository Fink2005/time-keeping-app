import { useGetMe } from '@/services/queries/useUser';
import { formatName } from '@/utils/global';
import { mmkvStorage } from '@/utils/mmkvStorage';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

type ProfileCardProps = {
  title?: string;
  subtitle: string;
  description: string;
  icon: any;
  to?: any;
};

const ProfileCard = ({ title, description, subtitle, icon, to }: ProfileCardProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const handlePress = () => {
    if (!to) return;
    router.push(to);
  };
  return (
    <View className="gap-3 p-4 mt-4 border border-gray-200 rounded-xl">
      {title && <Text className="text-lg font-semibold">{title}</Text>}
      <View className="flex-row items-center justify-between">
        <Pressable className="flex-row items-center flex-1 gap-4" onPress={handlePress}>
          <Feather name={icon} size={18} color="#3b82f6" />
          <View className="flex-shrink">
            <Text className="text-base font-medium">{subtitle}</Text>
            <Text className="text-sm text-gray-500">{description}</Text>
          </View>
        </Pressable>

        {!to && (
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#d1d5db"
            style={{ transform: [{ scale: 0.8 }] }}
          />
        )}
      </View>
    </View>
  );
};

const Profile = () => {
  const { data } = useGetMe();
  const handleLogout = async () => {
    await mmkvStorage.removeItem('accessToken');
    router.replace('/(screens)/(authScreen)/LoginScreen');
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="flex-row items-center w-full gap-4 p-4 border border-gray-200 rounded-xl ">
        <View
          className={'flex-row items-center justify-center gap-4 size-16 bg-[#03897B] rounded-full'}
        >
          {data && data.name && (
            <Text className="text-2xl font-medium text-white">{formatName(data.name)}</Text>
          )}
        </View>
        <View>
          <Text className="text-lg font-semibold">{data?.name}</Text>
          <Text className="text-sm text-gray-500">{data?.email}</Text>
        </View>
      </View>

      <ProfileCard
        title="Quản lý bảo mật"
        subtitle="Đổi mật khẩu"
        description="Thay đổi mật khẩu đăng nhập của bạn"
        icon="lock"
        to="/(screens)/"
      />
      <ProfileCard
        title="Giao diện"
        subtitle="Chế độ sáng/tối"
        description="Điều chỉnh giao diện sáng tối phù hợp với sở thích của bạn"
        icon="sun"
      />
      <ProfileCard
        title="Tính năng đề xuất"
        subtitle="Hỗ trợ trò chuyện"
        description="Nhận hỗ trợ ngay lập tức từ đội ngũ của chúng tôi."
        icon="message-circle"
        to="/"
      />
      <ProfileCard
        subtitle="Đánh giá ứng dụng"
        description="Giúp chúng tôi cải thiện bằng cách để lại phản hồi."
        icon="star"
        to="/"
      />

      <Pressable
        className="flex-row justify-center gap-2 p-3 mt-10 bg-orange-600 rounded-lg"
        onPress={handleLogout}
      >
        <Feather name="log-out" size={24} color="white" />
        <Text className="text-lg text-white">Đăng xuất</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
