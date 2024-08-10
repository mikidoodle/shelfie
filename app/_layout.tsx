import { Stack } from "expo-router";
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
      <Stack.Screen
        name="review"
        options={{
          presentation: "modal"
        }}
      />
      <Stack.Screen
        name="firstinstall"
        options={{
          presentation: "modal",
          gestureEnabled: false
        }}
      />
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="home/index" />
    </Stack>
  );
}
