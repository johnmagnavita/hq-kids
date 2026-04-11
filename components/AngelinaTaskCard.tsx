import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Task, CompletionStatus } from "../types";

interface Props {
  task: Task;
  status?: CompletionStatus | null;
  onPress: () => void;
}

export function AngelinaTaskCard({ task, status, onPress }: Props) {
  const isCompleted = status === "approved";
  const color = "#F472B6";

  return (
    <Pressable
      onPress={isCompleted ? undefined : onPress}
      style={{
        width: "47%",
        aspectRatio: 1,
        backgroundColor: isCompleted ? "#DCFCE7" : "#FFF",
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        margin: "1.5%",
        borderWidth: 3,
        borderColor: isCompleted ? "#22C55E" : color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      {isCompleted ? (
        <MaterialCommunityIcons
          name="check-circle"
          size={64}
          color="#22C55E"
        />
      ) : (
        <MaterialCommunityIcons
          name={(task.icon as any) || "star"}
          size={64}
          color={color}
        />
      )}
    </Pressable>
  );
}
