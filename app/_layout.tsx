import { Stack } from "expo-router";
import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#fff",
        },
        animation: "fade",
      }}
    >
      <Stack.Screen name="index"/>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="home/index" />
    </Stack>
  )
}
