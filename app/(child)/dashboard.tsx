import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import { useChildStore } from "../../stores/childStore";
import { useTaskStore } from "../../stores/taskStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getLevelInfo } from "../../types";
import type { Task } from "../../types";

export default function ChildDashboard() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { activeChild, activeStats, children, fetchStats } = useChildStore();
  const { tasks, completions, fetchTasksForChild, fetchCompletions } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  const child = activeChild();
  const st = activeStats();
  const level = st ? getLevelInfo(st.xp_total) : null;
  const isAngelina = child && child.age < 6;

  useEffect(() => {
    if (child) {
      fetchTasksForChild(child.id);
      fetchCompletions(child.id);
    }
  }, [child?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (child) {
      await fetchTasksForChild(child.id);
      await fetchCompletions(child.id);
      await fetchStats(child.id);
    }
    setRefreshing(false);
  };

  const isCompleted = (taskId: string) =>
    completions.some((c) => c.task_id === taskId && c.status === "approved");

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const key = t.type || "outro";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const sectionLabels: Record<string, string> = {
    casa: "🏠  Casa",
    escola: "📚  Escola",
    desafio: "⚡  Desafios",
  };

  if (!child) return null;

  const color = child.theme_color;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#39FF14" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {isAngelina ? "👋" : `Ola, ${child.name}! 👋`}
            </Text>
          </View>
          <View style={styles.coinBadge}>
            <MaterialCommunityIcons name="circle-multiple" size={16} color="#F59E0B" />
            <Text style={styles.coinText}>{st?.coins_balance ?? 0}</Text>
          </View>
        </View>

        {/* Profile + XP */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarRing, { borderColor: "#39FF14" }]}>
            <View style={[styles.avatar, { backgroundColor: color }]}>
              <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
            </View>
          </View>

          {!isAngelina && level && (
            <>
              <Text style={styles.levelText}>Nivel {level.level} — {level.name}</Text>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: `${Math.min((st?.xp_total ?? 0) / (level.next?.xp ?? 9999) * 100, 100)}%` }]} />
              </View>
              <Text style={styles.xpText}>{st?.xp_total ?? 0} / {(level.next?.xp ?? 9999)} XP</Text>
            </>
          )}

          {(st?.streak_current ?? 0) > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {st?.streak_current} dias seguidos!</Text>
            </View>
          )}
        </View>

        {/* Tasks */}
        {isAngelina ? (
          <View style={styles.angelinaGrid}>
            {tasks.map((task) => {
              const done = isCompleted(task.id);
              return (
                <Pressable
                  key={task.id}
                  style={[
                    styles.angelinaCard,
                    { borderColor: done ? "#39FF14" : color },
                    done && { backgroundColor: "#F0FDF4" },
                  ]}
                  onPress={() => !done && router.push(`/(child)/task/${task.id}`)}
                  disabled={done}
                >
                  {done ? (
                    <MaterialCommunityIcons name="check-circle" size={56} color="#39FF14" />
                  ) : (
                    <MaterialCommunityIcons name={(task.icon as any) || "star"} size={56} color={color} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.tasksContainer}>
            {Object.entries(grouped).map(([type, taskList]) => (
              <View key={type} style={styles.section}>
                <Text style={styles.sectionTitle}>{sectionLabels[type] || type}</Text>
                {taskList.map((task) => {
                  const done = isCompleted(task.id);
                  return (
                    <Pressable
                      key={task.id}
                      style={({ pressed }) => [
                        styles.taskCard,
                        done && styles.taskCardDone,
                        pressed && !done && { backgroundColor: "#FAFAFA" },
                      ]}
                      onPress={() => !done && router.push(`/(child)/task/${task.id}`)}
                      disabled={done}
                    >
                      <View style={[styles.taskIcon, { backgroundColor: done ? "rgba(57,255,20,0.1)" : `${color}15` }]}>
                        {done ? (
                          <MaterialCommunityIcons name="check" size={20} color="#39FF14" />
                        ) : (
                          <MaterialCommunityIcons name={(task.icon as any) || "star"} size={20} color={color} />
                        )}
                      </View>
                      <Text style={[styles.taskName, done && styles.taskNameDone]}>{task.name}</Text>
                      <View style={styles.taskRewards}>
                        <Text style={styles.taskXP}>+{task.xp_reward}</Text>
                        <MaterialCommunityIcons name="star" size={12} color="#39FF14" />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* Mini Ranking */}
        {!isAngelina && children.length > 1 && (
          <View style={styles.miniRanking}>
            <Text style={styles.sectionTitle}>🏆  Ranking</Text>
            <Pressable
              style={({ pressed }) => [styles.menuCard, pressed && { backgroundColor: "#FAFAFA" }]}
              onPress={() => router.push("/(child)/ranking")}
            >
              <Text style={styles.menuCardText}>Ver ranking completo</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#39FF14" />
            </Pressable>
          </View>
        )}

        {/* Store */}
        <Pressable
          style={({ pressed }) => [styles.storeCard, pressed && { backgroundColor: "#FAFAFA" }]}
          onPress={() => router.push("/(child)/store")}
        >
          <View style={styles.storeIcon}>
            <MaterialCommunityIcons name="gift" size={22} color="#A855F7" />
          </View>
          <Text style={styles.storeText}>Loja de Recompensas</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
        </Pressable>

        {/* Logout */}
        <Pressable
          style={styles.logoutBtn}
          onPress={async () => { await signOut(); router.replace("/"); }}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 8,
  },
  greeting: { fontSize: 24, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  coinBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(245,158,11,0.1)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  coinText: { fontSize: 15, fontWeight: "700", color: "#92400E" },

  profileSection: { alignItems: "center", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  avatarRing: {
    width: 78, height: 78, borderRadius: 39, borderWidth: 3,
    padding: 3, marginBottom: 12,
    shadowColor: "#39FF14", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 12,
  },
  avatar: {
    flex: 1, borderRadius: 36,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "700", color: "#FFF" },
  levelText: { fontSize: 14, color: "#6B7280", fontWeight: "600", marginBottom: 8 },
  xpBarTrack: {
    width: "80%", height: 8, borderRadius: 4,
    backgroundColor: "#E5E7EB", overflow: "hidden",
  },
  xpBarFill: { height: "100%", borderRadius: 4, backgroundColor: "#39FF14" },
  xpText: { fontSize: 12, color: "#9CA3AF", marginTop: 4, fontWeight: "600" },

  streakBadge: {
    marginTop: 12, backgroundColor: "rgba(239,68,68,0.08)",
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  streakText: { fontSize: 13, fontWeight: "700", color: "#DC2626" },

  tasksContainer: { paddingHorizontal: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 10 },

  taskCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", padding: 14, borderRadius: 14, marginBottom: 8,
    borderLeftWidth: 3, borderLeftColor: "#39FF14",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  taskCardDone: { backgroundColor: "#F0FDF4", borderLeftColor: "#39FF14" },
  taskIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  taskName: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },
  taskNameDone: { color: "#9CA3AF", textDecorationLine: "line-through" },
  taskRewards: { flexDirection: "row", alignItems: "center", gap: 3 },
  taskXP: { fontSize: 13, fontWeight: "700", color: "#16A34A" },

  angelinaGrid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 20, gap: 12, justifyContent: "center",
  },
  angelinaCard: {
    width: "46%", aspectRatio: 1,
    backgroundColor: "#FFFFFF", borderRadius: 24, borderWidth: 3,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },

  miniRanking: { paddingHorizontal: 24, marginBottom: 12 },
  menuCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  menuCardText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#39FF14" },

  storeCard: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 24, marginTop: 8, marginBottom: 12,
    backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, gap: 12,
    borderLeftWidth: 3, borderLeftColor: "#A855F7",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  storeIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(168,85,247,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  storeText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },

  logoutBtn: { alignItems: "center", paddingVertical: 16 },
  logoutText: { fontSize: 14, color: "#9CA3AF", fontWeight: "600" },
});
