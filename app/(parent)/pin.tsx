import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Vibration } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function PinScreen() {
  const router = useRouter();
  const { enterParentMode, pin: savedPin, pinReady, setPin: savePin } = useAuthStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [step, setStep] = useState<"enter" | "create" | "confirm">("enter");
  const [newPin, setNewPin] = useState("");

  const isFirstTime = pinReady && !savedPin;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const val = pin + digit;
    setPin(val);
    setError(false);

    if (val.length === 4) {
      if (isFirstTime || step === "create") {
        if (step === "confirm") {
          if (val === newPin) {
            savePin(val);
            enterParentMode(val);
            router.replace("/(parent)/dashboard");
          } else {
            setError(true);
            Vibration.vibrate(300);
            setTimeout(() => { setPin(""); setStep("create"); setNewPin(""); }, 400);
          }
        } else {
          setNewPin(val);
          setStep("confirm");
          setTimeout(() => setPin(""), 200);
        }
      } else {
        if (enterParentMode(val)) {
          router.replace("/(parent)/dashboard");
        } else {
          setError(true);
          Vibration.vibrate(300);
          setTimeout(() => setPin(""), 300);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.lock}>🔒</Text>
      <Text style={styles.title}>Modo Pai</Text>
      <Text style={styles.subtitle}>
        {isFirstTime || step === "create"
          ? step === "confirm" ? "Confirme o PIN" : "Crie um PIN de 4 digitos"
          : "Digite o PIN de 4 digitos"}
      </Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              pin.length > i && styles.dotFilled,
              error && pin.length > i && styles.dotError,
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
              style={({ pressed }) => [
                styles.key,
                !key && styles.keyEmpty,
                pressed && key ? styles.keyPressed : null,
              ]}
              onPress={() => {
                if (key === "⌫") handleDelete();
                else if (key) handleDigit(key);
              }}
            >
              <Text style={[styles.keyText, key === "⌫" && { fontSize: 22 }]}>{key}</Text>
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  backBtn: { position: "absolute", top: 60, left: 24 },
  backText: { fontSize: 16, color: "#06B6D4", fontWeight: "600" },
  lock: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 4, marginBottom: 32 },
  dots: { flexDirection: "row", gap: 20, marginBottom: 16 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#FFFFFF",
  },
  dotFilled: { backgroundColor: "#39FF14", borderColor: "#39FF14" },
  dotError: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  errorText: { color: "#EF4444", fontSize: 14, fontWeight: "600", marginBottom: 12 },
  keypad: {
    flexDirection: "row", flexWrap: "wrap",
    width: 270, justifyContent: "center", marginTop: 16,
  },
  key: {
    width: 74, height: 74, margin: 6, borderRadius: 37,
    backgroundColor: "#F8FAF9", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  keyPressed: { backgroundColor: "rgba(57,255,20,0.08)" },
  keyEmpty: { backgroundColor: "transparent", elevation: 0, shadowOpacity: 0 },
  keyText: { fontSize: 28, fontWeight: "600", color: "#111827" },
});
