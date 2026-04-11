import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { useChildStore } from "../stores/childStore";
import { ChildAvatar } from "../components/ChildAvatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { children, loading: childrenLoading, setActiveChild } = useChildStore();

  if (authLoading || childrenLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🦸‍♂️</Text>
          <Text style={styles.logo}>HQ Kids</Text>
          <Text style={styles.subtitle}>Missões em família!</Text>
        </View>

        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.parentButton}
        onPress={() => router.push("/(parent)/pin")}
      >
        <MaterialCommunityIcons name="shield-account" size={24} color="#6B7280" />
      </Pressable>

      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🦸‍♂️</Text>
        <Text style={styles.logo}>HQ Kids</Text>
        <Text style={styles.subtitle}>Quem vai jogar?</Text>
      </View>

      <View style={styles.avatars}>
        {children.map((child) => (
          <ChildAvatar
            key={child.id}
            child={child}
            size={90}
            onPress={() => {
              setActiveChild(child.id);
              router.push("/(child)/dashboard");
            }}
          />
        ))}
      </View>

      {children.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum perfil cadastrado ainda.{"\n"}Entre no modo pai para configurar!
        </Text>
      )}
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
  parentButton: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
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
  avatars: {
    flexDirection: "row",
    gap: 32,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 15,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
