import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useChildStore } from "../../stores/childStore";
import { supabase } from "../../services/supabase";
import { sendLocalNotification } from "../../services/notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Reward } from "../../types";

export default function StoreScreen() {
  const router = useRouter();
  const { activeChild, activeStats, updateStats } = useChildStore();
  const child = activeChild();
  const st = activeStats();
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => { fetchRewards(); }, []);

  const fetchRewards = async () => {
    if (!child) return;
    const { data } = await supabase
      .from("rewards").select("*")
      .or(`available_to.eq.${child.id},available_to.is.null`)
      .order("cost_coins");
    if (data) setRewards(data as Reward[]);
  };

  const handleRedeem = async (reward: Reward) => {
    if (!child || !st) return;
    if (st.coins_balance < reward.cost_coins) {
      Alert.alert("Moedas insuficientes", "Continue completando tarefas para ganhar mais moedas!");
      return;
    }
    Alert.alert(
      "Resgatar recompensa?",
      `Trocar ${reward.cost_coins} moedas por "${reward.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resgatar!",
          onPress: async () => {
            await supabase.from("reward_redemptions").insert({
              reward_id: reward.id, child_id: child.id,
              status: "pending", redeemed_at: new Date().toISOString(),
            });
            await updateStats(child.id, { coins_balance: st.coins_balance - reward.cost_coins });
            sendLocalNotification(
              `${child.name} resgatou uma recompensa!`,
              `"${reward.name}" por ${reward.cost_coins} moedas — aguardando aprovacao`
            );
            Alert.alert("Resgate solicitado!", "Aguardando confirmacao dos pais.");
          },
        },
      ]
    );
  };

  const color = child?.theme_color ?? "#39FF14";
  const isAngelina = child && child.age < 6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#A855F7" />
        </Pressable>
        <Text style={styles.title}>{isAngelina ? "🎁" : "Loja de Recompensas"}</Text>
        <View style={styles.coinBadge}>
          <MaterialCommunityIcons name="circle-multiple" size={16} color="#F59E0B" />
          <Text style={styles.coinText}>{st?.coins_balance ?? 0}</Text>
        </View>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        numColumns={isAngelina ? 2 : 1}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const canAfford = (st?.coins_balance ?? 0) >= item.cost_coins;

          if (isAngelina) {
            return (
              <Pressable
                style={[
                  styles.angelinaCard,
                  { borderColor: canAfford ? "#F472B6" : "#E5E7EB" },
                  !canAfford && { opacity: 0.4 },
                ]}
                onPress={() => handleRedeem(item)}
                disabled={!canAfford}
              >
                <MaterialCommunityIcons name={(item.icon as any) || "gift"} size={48} color={canAfford ? "#F472B6" : "#D1D5DB"} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <MaterialCommunityIcons name="circle-multiple" size={16} color="#F59E0B" />
                  <Text style={{ fontWeight: "700", color: "#92400E" }}>{item.cost_coins}</Text>
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              style={({ pressed }) => [styles.card, !canAfford && { opacity: 0.4 }, pressed && canAfford && { backgroundColor: "#FAFAFA" }]}
              onPress={() => handleRedeem(item)}
              disabled={!canAfford}
            >
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name={(item.icon as any) || "gift"} size={24} color="#A855F7" />
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.price}>
                <MaterialCommunityIcons name="circle-multiple" size={16} color="#F59E0B" />
                <Text style={styles.priceText}>{item.cost_coins}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>{isAngelina ? "😢" : "Nenhuma recompensa disponivel."}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(168,85,247,0.08)",
    justifyContent: "center", alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111827", letterSpacing: -0.3 },
  coinBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(245,158,11,0.1)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  coinText: { fontSize: 15, fontWeight: "700", color: "#92400E" },

  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, marginBottom: 10,
    borderLeftWidth: 3, borderLeftColor: "#A855F7",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  cardIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "rgba(168,85,247,0.1)",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "600", color: "#111827" },
  price: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 18, fontWeight: "800", color: "#92400E" },

  angelinaCard: {
    width: "47%", aspectRatio: 1, margin: "1.5%",
    backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 3,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 16 },
});
