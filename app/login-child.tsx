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
          "Conta criada! 🎉",
          "Agora peça ao seu pai/mãe para vincular seu email no app dele.",
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
        {isSignUp ? "Criar minha conta" : "Entrar"}
      </Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? "Crie sua conta e peça pro pai/mãe te vincular"
          : "Use seu email e senha"}
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
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? "Já tem conta? Entrar"
            : "Não tem conta? Criar"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
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
    color: "#22C55E",
  },
  emoji: {
    fontSize: 64,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#22C55E",
    textAlign: "center",
    marginTop: 16,
    fontSize: 15,
  },
});
