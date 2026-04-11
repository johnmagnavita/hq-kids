import { View, Text } from "react-native";
import { getLevelInfo } from "../types";

interface Props {
  xp: number;
  color: string;
}

export function XPBar({ xp, color }: Props) {
  const level = getLevelInfo(xp);

  return (
    <View style={{ marginVertical: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color }}>
          Nível {level.level} — {level.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
          {xp} XP{level.next ? ` / ${level.next.xp}` : ""}
        </Text>
      </View>
      <View
        style={{
          height: 12,
          backgroundColor: "#E5E7EB",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${level.progressToNext * 100}%`,
            backgroundColor: color,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
}
