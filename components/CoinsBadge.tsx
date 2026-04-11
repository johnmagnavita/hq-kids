import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  amount: number;
  size?: "sm" | "lg";
}

export function CoinsBadge({ amount, size = "sm" }: Props) {
  const iconSize = size === "lg" ? 28 : 18;
  const fontSize = size === "lg" ? 20 : 14;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingHorizontal: size === "lg" ? 14 : 10,
        paddingVertical: size === "lg" ? 6 : 4,
        borderRadius: 20,
      }}
    >
      <MaterialCommunityIcons
        name="circle-multiple"
        size={iconSize}
        color="#FBBF24"
      />
      <Text
        style={{
          marginLeft: 4,
          fontSize,
          fontWeight: "bold",
          color: "#92400E",
        }}
      >
        {amount}
      </Text>
    </View>
  );
}
