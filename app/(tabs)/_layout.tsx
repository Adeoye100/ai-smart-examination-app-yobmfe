
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'materials',
      route: '/(tabs)/materials',
      icon: 'doc.fill',
      label: 'Materials',
    },
    {
      name: 'exams',
      route: '/(tabs)/exams',
      icon: 'pencil',
      label: 'Exams',
    },
    {
      name: 'results',
      route: '/(tabs)/results',
      icon: 'chart.bar.fill',
      label: 'Results',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="materials">
          <Icon sf="doc.fill" drawable="ic_materials" />
          <Label>Materials</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="exams">
          <Icon sf="pencil" drawable="ic_exams" />
          <Label>Exams</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="results">
          <Icon sf="chart.bar.fill" drawable="ic_results" />
          <Label>Results</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="materials" />
        <Stack.Screen name="exams" />
        <Stack.Screen name="results" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
