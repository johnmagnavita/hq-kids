import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../stores/authStore";
import { useChildStore } from "../../../stores/childStore";
import { supabase } from "../../../services/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const REWARD_ICONS = [
  "gamepad-variant",
  "youtube-tv",
  "ice-cream",
  "pizza",
  "movie-open",
  "shopping",
  "sleep",
  "bike",
  "cellphone",
  "candy",
  "gift",
  "star-circle",
] as const;

export default function CreateReward() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { children } = useChildStore();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("gift");
  const [costCoins, setCostCoins] = useState(10);
  const [availableTo, setAvailableTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !user) {
      Alert.alert("Erro", "Digite o nome da recompensa");
      return;
    }
    setLoading(true);
    await supabase.from("rewards").insert({
      name: name.trim(),
      icon,
      cost_coins: costCoins,
      available_to: availableTo,
      created_by: user.id,
    });
    setLoading(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Cancelar</Text>
        </Pressable>
        <Text style={styles.title}>Nova Recompensa</Text>
        <Pressable onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, loading && { opacity: 0.5 }]}>
            Salvar
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1h de videogame"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Ícone</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {REWARD_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => setIcon(ic)}
              style={[styles.iconOpt, icon === ic && styles.iconSel]}
            >
              <MaterialCommunityIcons
                name={ic as any}
                size={28}
                color={icon === ic ? "#A855F7" : "#9CA3AF"}
              />
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Custo: {costCoins} moedas</Text>
        <View style={styles.sliderRow}>
          <Pressable
            onPress={() => setCostCoins(Math.max(1, costCoins - 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>-</Text>
          </Pressable>
          <View style={[styles.sliderBar, { flex: 1 }]}>
            <View
              style={{
                height: "100%",
                width: `${Math.min(100, (costCoins / 100) * 100)}%`,
                backgroundColor: "#FBBF24",
                borderRadius: 4,
              }}
            />
          </View>
          <Pressable
            onPress={() => setCostCoins(Math.min(200, costCoins + 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Disponível para</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.chip, !availableTo && styles.chipSel]}
            onPress={() => setAvailableTo(null)}
          >
            <Text style={[styles.chipText, !availableTo && { color: "#FFF" }]}>
              Todos
            </Text>
          </Pressable>
          {children.map((child) => (
            <Pressable
              key={child.id}
              style={[
                styles.chip,
                availableTo === child.id && {
                  backgroundColor: child.theme_color,
                  borderColor: child.theme_color,
                },
              ]}
              onPress={() => setAvailableTo(child.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  availableTo === child.id && { color: "#FFF" },
                ]}
              >
                {child.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backText: { fontSize: 16, color: "#EF4444" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  saveText: { fontSize: 16, color: "#A855F7", fontWeight: "700" },
  scroll: { flex: 1, paddingHorizontal: 24 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  chipSel: { backgroundColor: "#A855F7", borderColor: "#A855F7" },
  chipText: { fontSize: 14, color: "#374151" },
  iconOpt: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconSel: { borderColor: "#A855F7", backgroundColor: "#F5F3FF" },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  sliderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderBtnText: { fontSize: 20, fontWeight: "bold", color: "#374151" },
  sliderBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
});
