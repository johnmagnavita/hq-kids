import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  streak: number;
  size?: "sm" | "lg";
}

export function StreakBadge({ streak, size = "sm" }: Props) {
  const iconSize = size === "lg" ? 28 : 18;
  const fontSize = size === "lg" ? 20 : 14;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
        paddingHorizontal: size === "lg" ? 14 : 10,
        paddingVertical: size === "lg" ? 6 : 4,
        borderRadius: 20,
      }}
    >
      <MaterialCommunityIcons
        name="fire"
        size={iconSize}
        color="#EF4444"
      />
      <Text
        style={{
          marginLeft: 4,
          fontSize,
          fontWeight: "bold",
          color: "#991B1B",
        }}
      >
        {streak}
      </Text>
    </View>
  );
}
