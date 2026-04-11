import { Stack } from "expo-router";

export default function ChildLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFF9F0" },
      }}
    />
  );
}
