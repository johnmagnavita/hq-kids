import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../stores/authStore";
import { useChildStore } from "../stores/childStore";

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const fetchChildren = useChildStore((s) => s.fetchChildren);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      fetchChildren(user.id);
    }
  }, [user]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFF9F0" },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
