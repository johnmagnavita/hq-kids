import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Vibration, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function SettingsScreen() {
  const router = useRouter();
  const { pin, setPin, signOut } = useAuthStore();
  const [step, setStep] = useState<"current" | "new" | "confirm">(pin ? "current" : "new");
  const [input, setInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState(false);

  const title = step === "current" ? "PIN atual" : step === "new" ? "Novo PIN" : "Confirme o PIN";

  const handleDigit = (digit: string) => {
    if (input.length >= 4) return;
    const val = input + digit;
    setInput(val);
    setError(false);

    if (val.length === 4) {
      if (step === "current") {
        if (val === pin) {
          setStep("new");
          setInput("");
        } else {
          setError(true);
          Vibration.vibrate(300);
          setTimeout(() => setInput(""), 300);
        }
      } else if (step === "new") {
        setNewPin(val);
        setStep("confirm");
        setInput("");
      } else {
        if (val === newPin) {
          setPin(val);
          Alert.alert("PIN atualizado", "Seu novo PIN foi salvo.");
          router.back();
        } else {
          setError(true);
          Vibration.vibrate(300);
          setTimeout(() => {
            setInput("");
            setStep("new");
            setNewPin("");
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🔑 {pin ? "Trocar" : "Criar"} PIN</Text>
      <Text style={styles.subtitle}>{title}</Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              input.length > i && styles.dotFilled,
              error && styles.dotError,
            ]}
          />
        ))}
      </View>

      {error && (
        <Text style={styles.errorText}>
          {step === "current" ? "PIN incorreto" : "PINs não conferem"}
        </Text>
      )}

      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
          (key) => (
            <Pressable
              key={key || "empty"}
              style={[styles.key, !key && styles.keyEmpty]}
              onPress={() => {
                if (key === "⌫") handleDelete();
                else if (key) handleDigit(key);
              }}
            >
              <Text style={styles.keyText}>{key}</Text>
            </Pressable>
          )
        )}
      </View>
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
  backButton: { position: "absolute", top: 60, left: 24 },
  backText: { fontSize: 16, color: "#3B82F6" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 4, marginBottom: 32 },
  dots: { flexDirection: "row", gap: 16, marginBottom: 16 },
  dot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#D1D5DB",
  },
  dotFilled: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  dotError: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  errorText: { color: "#EF4444", marginBottom: 16 },
  keypad: {
    flexDirection: "row", flexWrap: "wrap",
    width: 260, justifyContent: "center", marginTop: 16,
  },
  key: {
    width: 72, height: 72, margin: 6, borderRadius: 36,
    backgroundColor: "#FFF", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  keyEmpty: { backgroundColor: "transparent", elevation: 0, shadowOpacity: 0 },
  keyText: { fontSize: 28, fontWeight: "600", color: "#1F2937" },
});
