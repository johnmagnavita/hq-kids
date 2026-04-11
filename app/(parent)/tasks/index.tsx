import { useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../stores/authStore";
import { useTaskStore } from "../../../stores/taskStore";
import { useChildStore } from "../../../stores/childStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Task } from "../../../types";

const TYPE_LABELS: Record<string, string> = {
  casa: "🏠 Casa",
  escola: "📚 Escola",
  desafio: "⚡ Desafio",
};

const RECURRENCE_LABELS: Record<string, string> = {
  diaria: "Diária",
  semanal: "Semanal",
  unica: "Única",
};

export default function TasksList() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { tasks, fetchTasks, deleteTask } = useTaskStore();
  const { children } = useChildStore();

  useEffect(() => {
    if (user) fetchTasks(user.id);
  }, [user]);

  const getChildName = (id: string | null) => {
    if (!id) return "Todos";
    return children.find((c) => c.id === id)?.name ?? "—";
  };

  const handleDelete = (task: Task) => {
    Alert.alert("Excluir tarefa", `Excluir "${task.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteTask(task.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Tarefas</Text>
        <Pressable onPress={() => router.push("/(parent)/tasks/create")}>
          <MaterialCommunityIcons name="plus-circle" size={28} color="#3B82F6" />
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onLongPress={() => handleDelete(item)}
          >
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name={(item.icon as any) || "star"}
                size={24}
                color="#3B82F6"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                {TYPE_LABELS[item.type]} · {RECURRENCE_LABELS[item.recurrence]} ·{" "}
                {getChildName(item.assigned_to)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.xpText}>{item.xp_reward} XP</Text>
              <Text style={styles.coinText}>{item.coins_reward} 🪙</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma tarefa criada ainda.</Text>
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
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  cardMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  xpText: { fontSize: 13, color: "#22C55E", fontWeight: "600" },
  coinText: { fontSize: 13, color: "#FBBF24", fontWeight: "600" },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },
});
