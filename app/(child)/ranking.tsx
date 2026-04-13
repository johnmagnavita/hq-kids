import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useChildStore } from "../../stores/childStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { XPBar } from "../../components/XPBar";
import { StreakBadge } from "../../components/StreakBadge";

export default function RankingScreen() {
  const router = useRouter();
  const { children, stats } = useChildStore();

  const ranking = children
    .map((c) => ({
      child: c,
      stats: stats[c.id],
    }))
    .sort((a, b) => (b.stats?.xp_total ?? 0) - (a.stats?.xp_total ?? 0));

  const medals = ["🥇", "🥈", "🥉"];

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
        <Text style={styles.title}>🏆 Ranking</Text>
        <View style={{ width: 24 }} />
      </View>

      {ranking.map((r, i) => (
        <View
          key={r.child.id}
          style={[styles.card, { borderLeftColor: r.child.theme_color }]}
        >
          <Text style={styles.medal}>{medals[i] ?? `${i + 1}º`}</Text>
          {r.child.avatar_url ? (
            <Image
              source={{ uri: r.child.avatar_url }}
              style={[styles.avatar, { backgroundColor: r.child.theme_color }]}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: r.child.theme_color },
              ]}
            >
              <Text style={styles.avatarText}>
                {r.child.name.charAt(0)}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{r.child.name}</Text>
            <XPBar
              xp={r.stats?.xp_total ?? 0}
              color={r.child.theme_color}
            />
            <View style={styles.statsRow}>
              <StreakBadge streak={r.stats?.streak_current ?? 0} />
              <Text style={styles.xpText}>
                {r.stats?.xp_total ?? 0} XP total
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F0", paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1F2937" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medal: { fontSize: 28 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "bold", fontSize: 20 },
  name: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 4 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  xpText: { fontSize: 13, color: "#6B7280" },
});
