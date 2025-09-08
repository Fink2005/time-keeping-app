import Header from '@/components/headers/Header';
import Feather from '@expo/vector-icons/Feather';

import { Tabs } from 'expo-router';
import React from 'react';

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { color: 'black', fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          header: () => <Header title="Vị trí hiện tại" />,
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="Location"
        options={{
          title: 'Địa điểm',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather name="map-pin" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Hồ sơ',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather name="user" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="Setting"
        options={{
          title: 'Cài đặt',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather name="settings" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
