import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/styles/theme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>New</Text> : null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "add" : "add-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Stats</Text> : null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
