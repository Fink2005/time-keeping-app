import Header from '@/components/headers/Header';
import HistoryHeader from '@/components/headers/HistoryHeader';
import Feather from '@expo/vector-icons/Feather';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
          title: 'Trang chủ',
          header: () => <Header title="Vị trí hiện tại" />,
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="Location"
        options={{
          title: 'Địa điểm',
          header: () => <Header title="Địa điểm đã lưu" />,
          tabBarIcon: ({ focused }) => (
            <Feather name="map-pin" size={20} color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: 'Lịch sử',
          header: () => <HistoryHeader minYear={2020} maxYear={2025} initialYear={2025} />,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="history" size={24} color={focused ? 'black' : 'gray'} />
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
    </Tabs>
  );
};

export default _Layout;
