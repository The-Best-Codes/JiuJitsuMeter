import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/styles/theme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused, color }) => null,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
              }}
            >
              <TabBarIcon
                name={focused ? "add" : "add-outline"}
                color={color}
              />
              {focused && (
                <Text style={{ color, fontSize: 12, marginTop: 2 }}>New</Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarLabel: ({ focused, color }) => null,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
              }}
            >
              <TabBarIcon
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
              />
              {focused && (
                <Text style={{ color, fontSize: 12, marginTop: 2 }}>Stats</Text>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
