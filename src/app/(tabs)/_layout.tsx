import React from 'react';

import { Icon, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

const _Layout = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="home"
        options={{
          title: 'Trang chủ',
        }}
      >
        {Platform.OS === 'ios' ? (
          <Icon sf="house" drawable="" />
        ) : (
          <Icon src={require('@/assets/icons/home.svg')} />
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="location"
        options={{
          title: 'Địa điểm',
        }}
      >
        {Platform.OS === 'ios' ? (
          <Icon sf="mappin.and.ellipse" drawable="" />
        ) : (
          <Icon src={require('@/assets/icons/map-pin.svg')} />
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="history"
        options={{
          title: 'Lịch sử',
        }}
      >
        {Platform.OS === 'ios' ? (
          <Icon sf="clock" drawable="" />
        ) : (
          <Icon src={require('@/assets/icons/history.svg')} />
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="profile"
        options={{
          title: 'Hồ sơ',
        }}
      >
        {Platform.OS === 'ios' ? (
          <Icon sf="person" drawable="" />
        ) : (
          <Icon src={require('@/assets/icons/user.svg')} />
        )}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default _Layout;
