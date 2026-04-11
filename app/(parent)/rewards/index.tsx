import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../stores/authStore";
import { useChildStore } from "../../../stores/childStore";
import { supabase } from "../../../services/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Reward } from "../../../types";

export default function RewardsList() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { children } = useChildStore();
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (user) fetchRewards();
  }, [user]);

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("rewards")
      .select("*")
      .eq("created_by", user!.id)
      .order("name");
    if (data) setRewards(data as Reward[]);
  };

  const handleDelete = (reward: Reward) => {
    Alert.alert("Excluir", `Excluir "${reward.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await supabase.from("rewards").delete().eq("id", reward.id);
          fetchRewards();
        },
      },
    ]);
  };

  const getChildName = (id: string | null) => {
    if (!id) return "Todos";
    return children.find((c) => c.id === id)?.name ?? "—";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Recompensas</Text>
        <Pressable onPress={() => router.push("/(parent)/rewards/create")}>
          <MaterialCommunityIcons name="plus-circle" size={28} color="#A855F7" />
        </Pressable>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onLongPress={() => handleDelete(item)}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name={(item.icon as any) || "gift"}
                size={24}
                color="#A855F7"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                Para: {getChildName(item.available_to)}
              </Text>
            </View>
            <View style={styles.price}>
              <MaterialCommunityIcons
                name="circle-multiple"
                size={16}
                color="#FBBF24"
              />
              <Text style={styles.priceText}>{item.cost_coins}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma recompensa criada.</Text>
        }
      />
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
  backText: { fontSize: 16, color: "#A855F7" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1F2937" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  cardMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  price: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 16, fontWeight: "bold", color: "#92400E" },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },
});
