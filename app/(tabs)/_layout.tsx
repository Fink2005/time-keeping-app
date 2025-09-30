import React from 'react';

import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: () => require('@/assets/icons/home.svg'),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'Địa điểm',
          tabBarIcon: () => require('@/assets/icons/map-pin.svg'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: () => require('@/assets/icons/history.svg'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          // header: () => <Header title="Quản lý tài khoản" isDisplayUserInfo />,
          tabBarIcon: () => require('@/assets/icons/user.svg'),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
