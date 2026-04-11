import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Vibration } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function PinScreen() {
  const router = useRouter();
  const enterParentMode = useAuthStore((s) => s.enterParentMode);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (enterParentMode(newPin)) {
        router.replace("/(parent)/dashboard");
      } else {
        setError(true);
        Vibration.vibrate(300);
        setTimeout(() => setPin(""), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🔒 Modo Pai</Text>
      <Text style={styles.subtitle}>Digite o PIN de 4 dígitos</Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              pin.length > i && styles.dotFilled,
              error && styles.dotError,
            ]}
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>PIN incorreto</Text>}

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
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  backText: {
    fontSize: 16,
    color: "#3B82F6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 32,
  },
  dots: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  dotFilled: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  dotError: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 260,
    justifyContent: "center",
    marginTop: 16,
  },
  key: {
    width: 72,
    height: 72,
    margin: 6,
    borderRadius: 36,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  keyEmpty: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  keyText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2937",
  },
});
