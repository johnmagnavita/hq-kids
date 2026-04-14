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
    if (role === "parent") router.replace("/(parent)/dashboard");
    else if (role === "child" && childProfile) {
      setActiveChild(childProfile.id);
      router.replace("/(child)/dashboard");
    }
  }, [authLoading, user, role, childProfile]);

  if (authLoading || user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.iconRing}>
          <Text style={styles.iconText}>HQ</Text>
        </View>
        <Text style={styles.title}>HQ Kids</Text>
        <Text style={styles.subtitle}>Missoes em familia!</Text>
      </View>

      {/* Feature pills */}
      <View style={styles.pills}>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="camera" size={14} color="#39FF14" />
          <Text style={styles.pillText}>Foto + IA</Text>
        </View>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={styles.pillText}>XP e Ranking</Text>
        </View>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="gift" size={14} color="#A855F7" />
          <Text style={styles.pillText}>Recompensas</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable
          onPress={() => router.push("/login")}
          style={({ pressed }) => [styles.btnOutline, pressed && styles.btnPressed]}
        >
          <MaterialCommunityIcons name="shield-account" size={20} color="#06B6D4" />
          <Text style={styles.btnOutlineText}>Entrar como Pai/Mae</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/login-child")}
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
        >
          <MaterialCommunityIcons name="rocket-launch" size={20} color="#FFF" />
          <Text style={styles.btnPrimaryText}>Entrar como Filho(a)</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Feito com amor para familias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#39FF14",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  iconText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "500",
  },
  pills: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 48,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pillText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },
  buttons: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#06B6D4",
  },
  btnOutlineText: {
    color: "#06B6D4",
    fontSize: 16,
    fontWeight: "700",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    position: "absolute",
    bottom: 50,
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "500",
  },
});
