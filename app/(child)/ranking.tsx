import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useChildStore } from "../../stores/childStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getLevelInfo } from "../../types";

export default function RankingScreen() {
  const router = useRouter();
  const { children, stats } = useChildStore();

  const ranking = children
    .map((c) => ({ child: c, stats: stats[c.id] }))
    .sort((a, b) => (b.stats?.xp_total ?? 0) - (a.stats?.xp_total ?? 0));

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#39FF14" />
        </Pressable>
        <Text style={styles.title}>🏆 Ranking</Text>
        <View style={{ width: 36 }} />
      </View>

      {ranking.map((r, i) => {
        const xp = r.stats?.xp_total ?? 0;
        const maxXP = Math.max(...ranking.map((x) => x.stats?.xp_total ?? 1), 1);
        const pct = Math.min((xp / maxXP) * 100, 100);

        return (
          <View
            key={r.child.id}
            style={[
              styles.card,
              { borderLeftColor: r.child.theme_color },
              i === 0 && styles.cardChampion,
            ]}
          >
            <Text style={styles.medal}>{medals[i] ?? `${i + 1}º`}</Text>

            <View style={[styles.avatar, { backgroundColor: r.child.theme_color }]}>
              <Text style={styles.avatarText}>{r.child.name.charAt(0)}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{r.child.name}</Text>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: `${pct}%`, backgroundColor: r.child.theme_color }]} />
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                  <MaterialCommunityIcons name="star" size={12} color="#39FF14" />
                  <Text style={styles.statXP}>{xp} XP</Text>
                </View>
                {(r.stats?.streak_current ?? 0) > 0 && (
                  <View style={[styles.statBadge, { backgroundColor: "rgba(239,68,68,0.08)" }]}>
                    <Text style={{ fontSize: 11 }}>🔥</Text>
                    <Text style={styles.statStreak}>{r.stats?.streak_current}d</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 60, paddingBottom: 20,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(57,255,20,0.08)",
    justifyContent: "center", alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },

  card: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderLeftWidth: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardChampion: { backgroundColor: "#F0FDF4" },
  medal: { fontSize: 28, width: 36, textAlign: "center" },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "700", fontSize: 18 },
  name: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 6 },
  xpBarTrack: {
    height: 6, borderRadius: 3, backgroundColor: "#E5E7EB",
    overflow: "hidden", marginBottom: 6,
  },
  xpBarFill: { height: "100%", borderRadius: 3 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "rgba(57,255,20,0.08)",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
  },
  statXP: { fontSize: 12, fontWeight: "700", color: "#16A34A" },
  statStreak: { fontSize: 12, fontWeight: "700", color: "#DC2626" },
});
