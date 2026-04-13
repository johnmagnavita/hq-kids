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
import { CoinsBadge } from "../../components/CoinsBadge";
import type { Reward } from "../../types";

export default function StoreScreen() {
  const router = useRouter();
  const { activeChild, activeStats, updateStats } = useChildStore();
  const child = activeChild();
  const st = activeStats();
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    if (!child) return;
    const { data } = await supabase
      .from("rewards")
      .select("*")
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
              reward_id: reward.id,
              child_id: child.id,
              status: "pending",
              redeemed_at: new Date().toISOString(),
            });
            await updateStats(child.id, {
              coins_balance: st.coins_balance - reward.cost_coins,
            });
            sendLocalNotification(
              `${child.name} resgatou uma recompensa!`,
              `"${reward.name}" por ${reward.cost_coins} moedas — aguardando aprovação`
            );
            Alert.alert(
              "Resgate solicitado! 🎉",
              "Aguardando confirmação dos pais."
            );
          },
        },
      ]
    );
  };

  const color = child?.theme_color ?? "#3B82F6";
  const isAngelina = child && child.age < 6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#6B7280"
          />
        </Pressable>
        <Text style={styles.title}>
          {isAngelina ? "🎁" : "Loja de Recompensas"}
        </Text>
        <CoinsBadge amount={st?.coins_balance ?? 0} size="lg" />
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        numColumns={isAngelina ? 2 : 1}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => {
          const canAfford = (st?.coins_balance ?? 0) >= item.cost_coins;

          if (isAngelina) {
            return (
              <Pressable
                style={[
                  styles.angelinaCard,
                  { borderColor: canAfford ? color : "#E5E7EB" },
                  !canAfford && { opacity: 0.5 },
                ]}
                onPress={() => handleRedeem(item)}
                disabled={!canAfford}
              >
                <MaterialCommunityIcons
                  name={(item.icon as any) || "gift"}
                  size={48}
                  color={canAfford ? color : "#D1D5DB"}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name="circle-multiple"
                    size={18}
                    color="#FBBF24"
                  />
                  <Text style={{ fontWeight: "bold", color: "#92400E" }}>
                    {item.cost_coins}
                  </Text>
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              style={[styles.card, !canAfford && { opacity: 0.5 }]}
              onPress={() => handleRedeem(item)}
              disabled={!canAfford}
            >
              <View
                style={[styles.cardIcon, { backgroundColor: `${color}15` }]}
              >
                <MaterialCommunityIcons
                  name={(item.icon as any) || "gift"}
                  size={28}
                  color={color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              <View style={styles.price}>
                <MaterialCommunityIcons
                  name="circle-multiple"
                  size={18}
                  color="#FBBF24"
                />
                <Text style={styles.priceText}>{item.cost_coins}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isAngelina ? "😢" : "Nenhuma recompensa disponível."}
          </Text>
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
  title: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  price: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 18, fontWeight: "bold", color: "#92400E" },
  angelinaCard: {
    width: "47%",
    aspectRatio: 1,
    margin: "1.5%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 16 },
});
