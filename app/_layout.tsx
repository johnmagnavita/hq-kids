import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../stores/authStore";
import { useChildStore } from "../stores/childStore";
import { registerForPushNotifications } from "../services/notifications";

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const childProfile = useAuthStore((s) => s.childProfile);
  const { fetchChildren, setActiveChild, fetchStats } = useChildStore();

  useEffect(() => {
    initialize();
    registerForPushNotifications().catch(() => {});
  }, []);

  useEffect(() => {
    if (user && role === "parent") {
      fetchChildren(user.id);
    }
    if (user && role === "child" && childProfile) {
      // Fetch siblings for ranking
      fetchChildren(childProfile.parent_id);
      setActiveChild(childProfile.id);
      fetchStats(childProfile.id);
    }
  }, [user, role, childProfile?.id]);

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
