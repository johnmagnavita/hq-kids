import { useEffect } from "react";
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
import { CoinsBadge } from "../../components/CoinsBadge";
import { StreakBadge } from "../../components/StreakBadge";
import { getLevelInfo } from "../../types";
import { useState } from "react";

export default function ParentDashboard() {
  const router = useRouter();
  const { exitParentMode, user } = useAuthStore();
  const { children, stats, fetchChildren, fetchAllStats } = useChildStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchChildren(user.id);
      fetchTasks(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (children.length > 0) {
      fetchAllStats();
    }
  }, [children]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchChildren(user.id);
      await fetchAllStats();
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard Pai</Text>
          <Text style={styles.subtitle}>{tasks.length} tarefas criadas</Text>
        </View>
        <Pressable
          style={styles.exitButton}
          onPress={() => {
            exitParentMode();
            router.replace("/");
          }}
        >
          <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {children.map((child) => {
          const st = stats[child.id];
          const level = st ? getLevelInfo(st.xp_total) : null;

          return (
            <View
              key={child.id}
              style={[styles.childCard, { borderLeftColor: child.theme_color }]}
            >
              <View style={styles.childHeader}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: child.theme_color },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {child.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.childName}>{child.name}</Text>
                  {level && (
                    <Text style={styles.childLevel}>
                      Nível {level.level} — {level.name}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.childStats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name="star"
                    size={18}
                    color="#22C55E"
                  />
                  <Text style={styles.statText}>{st?.xp_total ?? 0} XP</Text>
                </View>
                <CoinsBadge amount={st?.coins_balance ?? 0} />
                <StreakBadge streak={st?.streak_current ?? 0} />
              </View>
            </View>
          );
        })}

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: "#3B82F6" }]}
            onPress={() => router.push("/(parent)/tasks/create")}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#FFF" />
            <Text style={styles.actionText}>Nova Tarefa</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: "#A855F7" }]}
            onPress={() => router.push("/(parent)/rewards/create")}
          >
            <MaterialCommunityIcons name="gift" size={22} color="#FFF" />
            <Text style={styles.actionText}>Nova Recompensa</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.listButton}
          onPress={() => router.push("/(parent)/tasks")}
        >
          <MaterialCommunityIcons
            name="clipboard-list"
            size={20}
            color="#3B82F6"
          />
          <Text style={styles.listButtonText}>Ver Todas as Tarefas</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#3B82F6"
          />
        </Pressable>

        <Pressable
          style={styles.listButton}
          onPress={() => router.push("/(parent)/rewards")}
        >
          <MaterialCommunityIcons name="gift" size={20} color="#A855F7" />
          <Text style={[styles.listButtonText, { color: "#A855F7" }]}>
            Ver Recompensas
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#A855F7"
          />
        </Pressable>

        <Pressable
          style={styles.listButton}
          onPress={() => router.push("/(parent)/history")}
        >
          <MaterialCommunityIcons name="history" size={20} color="#6B7280" />
          <Text style={[styles.listButtonText, { color: "#6B7280" }]}>
            Histórico de Fotos
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#6B7280"
          />
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  childCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  childLevel: {
    fontSize: 13,
    color: "#6B7280",
  },
  childStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
  },
  actionText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  listButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
});
