import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useChildStore } from "../../stores/childStore";
import { useTaskStore } from "../../stores/taskStore";
import { ChildAvatar } from "../../components/ChildAvatar";
import { XPBar } from "../../components/XPBar";
import { CoinsBadge } from "../../components/CoinsBadge";
import { StreakBadge } from "../../components/StreakBadge";
import { TaskCard } from "../../components/TaskCard";
import { AngelinaTaskCard } from "../../components/AngelinaTaskCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Task, CompletionStatus } from "../../types";

export default function ChildDashboard() {
  const router = useRouter();
  const { activeChild, activeStats, fetchStats, children, stats } =
    useChildStore();
  const { tasks, completions, fetchTasksForChild, fetchCompletions } =
    useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  const child = activeChild();
  const st = activeStats();

  useEffect(() => {
    if (child) {
      fetchTasksForChild(child.id);
      fetchCompletions(child.id);
      fetchStats(child.id);
    }
  }, [child?.id]);

  const onRefresh = async () => {
    if (!child) return;
    setRefreshing(true);
    await Promise.all([
      fetchTasksForChild(child.id),
      fetchCompletions(child.id),
      fetchStats(child.id),
    ]);
    setRefreshing(false);
  };

  if (!child) {
    return (
      <View style={styles.container}>
        <Text>Perfil não encontrado</Text>
      </View>
    );
  }

  const isAngelina = child.age < 6;
  const color = child.theme_color;

  const getTaskStatus = (task: Task): CompletionStatus | null => {
    const completion = completions.find(
      (c) => c.task_id === task.id && c.status === "approved"
    );
    return completion?.status ?? null;
  };

  const groupedTasks = {
    casa: tasks.filter((t) => t.type === "casa"),
    escola: tasks.filter((t) => t.type === "escola"),
    desafio: tasks.filter((t) => t.type === "desafio"),
  };

  // Mini ranking
  const ranking = children
    .map((c) => ({
      child: c,
      xp: stats[c.id]?.xp_total ?? 0,
    }))
    .sort((a, b) => b.xp - a.xp);

  return (
    <View style={[styles.container]}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={color}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace("/")}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#6B7280"
            />
          </Pressable>
          <View style={{ flex: 1 }} />
          <CoinsBadge amount={st?.coins_balance ?? 0} size="lg" />
        </View>

        {/* Profile */}
        <View style={styles.profile}>
          <ChildAvatar child={child} size={70} showName={false} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={[styles.greeting, { color }]}>
              {isAngelina ? "👋" : `Olá, ${child.name}!`}
            </Text>
            <XPBar xp={st?.xp_total ?? 0} color={color} />
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <StreakBadge streak={st?.streak_current ?? 0} size="lg" />
          {!isAngelina && (
            <Text style={styles.streakLabel}>dias seguidos!</Text>
          )}
        </View>

        {/* Tasks */}
        {isAngelina ? (
          <View style={styles.angelinaGrid}>
            {tasks.map((task) => (
              <AngelinaTaskCard
                key={task.id}
                task={task}
                status={getTaskStatus(task)}
                onPress={() => router.push(`/(child)/task/${task.id}`)}
              />
            ))}
          </View>
        ) : (
          <>
            {Object.entries(groupedTasks).map(([type, typeTasks]) => {
              if (typeTasks.length === 0) return null;
              const label =
                type === "casa"
                  ? "🏠 Casa"
                  : type === "escola"
                  ? "📚 Escola"
                  : "⚡ Desafios";
              return (
                <View key={type} style={{ marginTop: 16 }}>
                  <Text style={styles.sectionTitle}>{label}</Text>
                  {typeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      status={getTaskStatus(task)}
                      color={color}
                      onPress={() =>
                        router.push(`/(child)/task/${task.id}`)
                      }
                    />
                  ))}
                </View>
              );
            })}
          </>
        )}

        {/* Mini Ranking */}
        {!isAngelina && (
          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>🏆 Ranking</Text>
            {ranking.map((r, i) => (
              <View key={r.child.id} style={styles.rankItem}>
                <Text style={styles.rankPos}>{i + 1}º</Text>
                <View
                  style={[
                    styles.rankAvatar,
                    { backgroundColor: r.child.theme_color },
                  ]}
                >
                  <Text style={styles.rankAvatarText}>
                    {r.child.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.rankName}>{r.child.name}</Text>
                <Text style={styles.rankXp}>{r.xp} XP</Text>
              </View>
            ))}

            <Pressable
              style={[styles.rankingBtn, { backgroundColor: color }]}
              onPress={() => router.push("/(child)/ranking")}
            >
              <Text style={styles.rankingBtnText}>Ver ranking completo</Text>
            </Pressable>
          </View>
        )}

        {/* Store button */}
        <Pressable
          style={[styles.storeBtn, { backgroundColor: color }]}
          onPress={() => router.push("/(child)/store")}
        >
          <MaterialCommunityIcons name="gift" size={24} color="#FFF" />
          <Text style={styles.storeBtnText}>Loja de Recompensas</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F0" },
  scroll: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 8,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  angelinaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  rankingSection: {
    marginTop: 24,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 6,
    gap: 10,
  },
  rankPos: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B7280",
    width: 28,
  },
  rankAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rankAvatarText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  rankName: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1F2937" },
  rankXp: { fontSize: 14, fontWeight: "600", color: "#22C55E" },
  rankingBtn: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  rankingBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  storeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  storeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
