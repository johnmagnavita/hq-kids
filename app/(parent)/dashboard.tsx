import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
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

export default function ParentDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuthStore();
  const { children, stats, fetchChildren, fetchAllStats } = useChildStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) { fetchChildren(user.id); fetchTasks(user.id); }
  }, [user]);

  useEffect(() => {
    if (children.length > 0) fetchAllStats();
  }, [children]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) { await fetchChildren(user.id); await fetchAllStats(); }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>{tasks.length} tarefas criadas</Text>
        </View>
        <Pressable
          style={styles.logoutBtn}
          onPress={async () => { await signOut(); router.replace("/"); }}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06B6D4" />}
      >
        {/* Children cards */}
        {children.map((child) => {
          const st = stats[child.id];
          const level = st ? getLevelInfo(st.xp_total) : null;

          return (
            <View key={child.id} style={[styles.childCard, { borderLeftColor: child.theme_color }]}>
              <View style={styles.childHeader}>
                {child.avatar_url ? (
                  <Image source={{ uri: child.avatar_url }} style={[styles.avatar, { backgroundColor: child.theme_color }]} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: child.theme_color }]}>
                    <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.childName}>{child.name}</Text>
                  {level && <Text style={styles.childLevel}>Nivel {level.level} — {level.name}</Text>}
                </View>
              </View>
              <View style={styles.childStats}>
                <View style={styles.statBadge}>
                  <MaterialCommunityIcons name="star" size={14} color="#39FF14" />
                  <Text style={[styles.statText, { color: "#16A34A" }]}>{st?.xp_total ?? 0} XP</Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: "rgba(245,158,11,0.08)" }]}>
                  <MaterialCommunityIcons name="circle-multiple" size={14} color="#F59E0B" />
                  <Text style={[styles.statText, { color: "#92400E" }]}>{st?.coins_balance ?? 0}</Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: "rgba(239,68,68,0.08)" }]}>
                  <Text style={{ fontSize: 12 }}>🔥</Text>
                  <Text style={[styles.statText, { color: "#DC2626" }]}>{st?.streak_current ?? 0}d</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: "#06B6D4" }, pressed && { opacity: 0.9 }]}
            onPress={() => router.push("/(parent)/tasks/create")}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
            <Text style={styles.actionText}>Nova Tarefa</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: "#A855F7" }, pressed && { opacity: 0.9 }]}
            onPress={() => router.push("/(parent)/rewards/create")}
          >
            <MaterialCommunityIcons name="gift" size={20} color="#FFF" />
            <Text style={styles.actionText}>Recompensa</Text>
          </Pressable>
        </View>

        {/* Menu */}
        {[
          { label: "Gerenciar Filhos", icon: "account-group" as const, color: "#39FF14", route: "/(parent)/children" },
          { label: "Ver Todas as Tarefas", icon: "clipboard-list" as const, color: "#06B6D4", route: "/(parent)/tasks" },
          { label: "Ver Recompensas", icon: "gift" as const, color: "#A855F7", route: "/(parent)/rewards" },
          { label: "Historico de Fotos", icon: "history" as const, color: "#6B7280", route: "/(parent)/history" },
          { label: "Trocar PIN", icon: "cog" as const, color: "#F59E0B", route: "/(parent)/settings" },
        ].map((item) => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: "#F8FAF9" }]}
            onPress={() => router.push(item.route as any)}
          >
            <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
            <Text style={[styles.menuText, { color: "#111827" }]}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
          </Pressable>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#F8FAF9", justifyContent: "center", alignItems: "center",
  },
  scroll: { flex: 1, paddingHorizontal: 24 },

  childCard: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12,
    borderLeftWidth: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  childHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  childName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  childLevel: { fontSize: 13, color: "#6B7280", marginTop: 1 },
  childStats: { flexDirection: "row", gap: 8 },
  statBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(57,255,20,0.08)",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  statText: { fontSize: 13, fontWeight: "700" },

  actions: { flexDirection: "row", gap: 12, marginTop: 8, marginBottom: 20 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  actionText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  menuItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, marginBottom: 8, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: "600" },
});
