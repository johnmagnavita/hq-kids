import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  xp: number;
  coins: number;
  message?: string;
  onDone: () => void;
}

export function CelebrationOverlay({
  visible,
  xp,
  coins,
  message,
  onDone,
}: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 500 }))
      );
      scale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 200 }),
        withDelay(1800, withTiming(0.5, { duration: 500 }))
      );

      const timer = setTimeout(() => {
        onDone();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Muito bem!</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.rewards}>
          <View style={styles.rewardItem}>
            <MaterialCommunityIcons name="star" size={28} color="#22C55E" />
            <Text style={styles.rewardText}>+{xp} XP</Text>
          </View>
          <View style={styles.rewardItem}>
            <MaterialCommunityIcons
              name="circle-multiple"
              size={28}
              color="#FBBF24"
            />
            <Text style={styles.rewardText}>+{coins}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "80%",
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  rewards: {
    flexDirection: "row",
    gap: 24,
    marginTop: 20,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rewardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
});
