import { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { useChildStore } from "../stores/childStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const { user, role, childProfile, loading: authLoading } = useAuthStore();
  const { setActiveChild } = useChildStore();

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    if (role === "parent") {
      router.replace("/(parent)/dashboard");
    } else if (role === "child" && childProfile) {
      setActiveChild(childProfile.id);
      router.replace("/(child)/dashboard");
    }
  }, [authLoading, user, role, childProfile]);

  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Logged in — waiting for redirect
  if (user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Not logged in
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🦸‍♂️</Text>
        <Text style={styles.logo}>HQ Kids</Text>
        <Text style={styles.subtitle}>Missões em família!</Text>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: "#3B82F6" }]}
        onPress={() => router.push("/login")}
      >
        <MaterialCommunityIcons name="shield-account" size={22} color="#FFF" />
        <Text style={styles.buttonText}>Entrar como Pai/Mãe</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#22C55E", marginTop: 12 }]}
        onPress={() => router.push("/login-child")}
      >
        <MaterialCommunityIcons name="account" size={22} color="#FFF" />
        <Text style={styles.buttonText}>Entrar como Filho(a)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 64,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    maxWidth: 300,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
