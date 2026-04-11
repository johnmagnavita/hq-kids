import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Task, CompletionStatus } from "../types";

interface Props {
  task: Task;
  status?: CompletionStatus | null;
  onPress: () => void;
  color: string;
}

const TYPE_LABELS: Record<string, string> = {
  casa: "🏠 Casa",
  escola: "📚 Escola",
  desafio: "⚡ Desafio",
};

export function TaskCard({ task, status, onPress, color }: Props) {
  const isCompleted = status === "approved";

  return (
    <Pressable
      onPress={isCompleted ? undefined : onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isCompleted ? "#F0FDF4" : "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: isCompleted ? "#22C55E" : color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: isCompleted ? "#DCFCE7" : `${color}20`,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        {isCompleted ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#22C55E"
          />
        ) : (
          <MaterialCommunityIcons
            name={(task.icon as any) || "star"}
            size={24}
            color={color}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: isCompleted ? "#6B7280" : "#1F2937",
            textDecorationLine: isCompleted ? "line-through" : "none",
          }}
        >
          {task.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
          {TYPE_LABELS[task.type] || task.type}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="star" size={14} color="#22C55E" />
          <Text style={{ fontSize: 13, color: "#22C55E", marginLeft: 2 }}>
            {task.xp_reward}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
        >
          <MaterialCommunityIcons
            name="circle-multiple"
            size={14}
            color="#FBBF24"
          />
          <Text style={{ fontSize: 13, color: "#FBBF24", marginLeft: 2 }}>
            {task.coins_reward}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
