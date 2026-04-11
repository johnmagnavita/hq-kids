import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import { useChildStore } from "../../stores/childStore";
import { supabase } from "../../services/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { TaskCompletion } from "../../types";

export default function HistoryScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { children } = useChildStore();
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const childIds = children.map((c) => c.id);
    if (childIds.length === 0) return;

    const { data } = await supabase
      .from("task_completions")
      .select("*, task:tasks(*)")
      .in("child_id", childIds)
      .order("completed_at", { ascending: false })
      .limit(50);

    if (data) setCompletions(data as TaskCompletion[]);
  };

  const getChildName = (id: string) =>
    children.find((c) => c.id === id)?.name ?? "—";
  const getChildColor = (id: string) =>
    children.find((c) => c.id === id)?.theme_color ?? "#6B7280";

  const handleManualApprove = async (completion: TaskCompletion) => {
    Alert.alert("Aprovar manualmente?", "Isso creditará XP e moedas.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aprovar",
        onPress: async () => {
          await supabase
            .from("task_completions")
            .update({ status: "approved" })
            .eq("id", completion.id);

          if (completion.task) {
            const child = children.find((c) => c.id === completion.child_id);
            if (child) {
              await supabase.rpc("credit_rewards", {
                p_child_id: child.id,
                p_xp: completion.task.xp_reward,
                p_coins: completion.task.coins_reward,
              });
            }
          }
          fetchHistory();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Histórico</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={completions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      item.status === "approved"
                        ? "#22C55E"
                        : item.status === "rejected"
                        ? "#EF4444"
                        : "#FBBF24",
                  },
                ]}
              />
              <Text style={styles.cardChild}>
                {getChildName(item.child_id)}
              </Text>
              <Text style={styles.cardTask}>
                {item.task?.name ?? "Tarefa"}
              </Text>
            </View>

            {item.photo_url && (
              <Image
                source={{ uri: item.photo_url }}
                style={styles.photo}
                resizeMode="cover"
              />
            )}

            {item.llm_response && (
              <Text style={styles.feedback}>{item.llm_response}</Text>
            )}

            <View style={styles.cardFooter}>
              <Text style={styles.date}>
                {new Date(item.completed_at).toLocaleDateString("pt-BR")}
              </Text>
              {item.status === "rejected" && (
                <Pressable
                  style={styles.approveBtn}
                  onPress={() => handleManualApprove(item)}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color="#FFF"
                  />
                  <Text style={styles.approveBtnText}>Aprovar</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum histórico ainda.</Text>
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
  backText: { fontSize: 16, color: "#3B82F6" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1F2937" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  cardChild: { fontWeight: "700", fontSize: 14, color: "#1F2937" },
  cardTask: { fontSize: 14, color: "#6B7280" },
  photo: { width: "100%", height: 160, borderRadius: 10, marginBottom: 8 },
  feedback: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12, color: "#9CA3AF" },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveBtnText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },
});
