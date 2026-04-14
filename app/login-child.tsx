import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";

export default function LoginChildScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert(
          "Conta criada!",
          "Agora peca ao seu pai/mae para vincular seu email no app dele.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        await signIn(email, password);
        router.replace("/(child)/dashboard");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.emoji}>🧒</Text>
      <Text style={styles.title}>
        {isSignUp ? "Criar minha conta" : "Ola, heroi!"}
      </Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? "Crie sua conta e peca pro pai/mae te vincular"
          : "Use o email que seu pai/mae cadastrou"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9CA3AF"
      />

      <Pressable
        style={({ pressed }) => [styles.btn, loading && { opacity: 0.6 }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>{isSignUp ? "Criar Conta" : "Entrar"}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp ? "Ja tem conta? Entrar" : "Nao tem conta? Criar"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  backText: {
    fontSize: 16,
    color: "#34D399",
    fontWeight: "600",
  },
  emoji: {
    fontSize: 56,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  btn: {
    backgroundColor: "#39FF14",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  switchText: {
    color: "#34D399",
    textAlign: "center",
    marginTop: 16,
    fontSize: 15,
    fontWeight: "500",
  },
});
