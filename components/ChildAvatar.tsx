import { View, Text, Pressable, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Child } from "../types";

interface Props {
  child: Child;
  size?: number;
  onPress?: () => void;
  showName?: boolean;
}

export function ChildAvatar({
  child,
  size = 80,
  onPress,
  showName = true,
}: Props) {
  const initials = child.name.charAt(0).toUpperCase();

  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: child.theme_color,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: child.theme_color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {child.avatar_url ? (
          <Image
            source={{ uri: child.avatar_url }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: size * 0.4,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {initials}
          </Text>
        )}
      </View>
      {showName && (
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: "700",
            color: child.theme_color,
          }}
        >
          {child.name}
        </Text>
      )}
    </Pressable>
  );
}
