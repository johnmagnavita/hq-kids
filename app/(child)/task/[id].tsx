import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useChildStore } from "../../../stores/childStore";
import { useTaskStore } from "../../../stores/taskStore";
import { analyzeTaskPhoto } from "../../../services/claude";
import { CelebrationOverlay } from "../../../components/CelebrationOverlay";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../../services/supabase";
import { sendLocalNotification } from "../../../services/notifications";
import type { Task } from "../../../types";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeChild, activeStats, updateStats, fetchStats } = useChildStore();
  const {
    tasks,
    createCompletion,
    updateCompletion,
    getTodayCompletionsCount,
    completions,
  } = useTaskStore();

  const child = activeChild();
  const st = activeStats();
  const task = tasks.find((t) => t.id === id);

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rejected, setRejected] = useState(false);

  if (!task || !child) {
    return (
      <View style={styles.container}>
        <Text>Tarefa não encontrada</Text>
      </View>
    );
  }

  const color = child.theme_color;
  const isAngelina = child.age < 6;
  const attemptsToday = getTodayCompletionsCount(task.id, child.id);
  const maxAttempts = 3;

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos da câmera para verificar a tarefa.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 ?? null);
      setFeedback(null);
      setRejected(false);
    }
  };

  const handleNoPhotoComplete = async () => {
    const completion = await createCompletion({
      task_id: task.id,
      child_id: child.id,
      photo_url: null,
      llm_response: null,
      status: "approved",
    });

    if (completion) {
      await creditRewards();
      setShowCelebration(true);
      sendLocalNotification(
        `${child.name} completou uma missão!`,
        `${task.name} — +${task.xp_reward} XP, +${task.coins_reward} moedas`
      );
    }
  };

  const handleSubmitPhoto = async () => {
    if (!photo || !photoBase64) return;
    setAnalyzing(true);
    setFeedback(null);
    setRejected(false);

    try {
      const base64 = photoBase64;

      // Upload photo to Supabase Storage
      const fileName = `${child.id}/${task.id}_${Date.now()}.jpg`;
      const { data: uploadData } = await supabase.storage
        .from("task-photos")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });

      const photoUrl = uploadData?.path
        ? supabase.storage.from("task-photos").getPublicUrl(uploadData.path)
            .data.publicUrl
        : null;

      // Analyze with Claude
      const result = await analyzeTaskPhoto(
        base64,
        task.name,
        task.llm_criteria || ""
      );

      // Create completion record
      const completion = await createCompletion({
        task_id: task.id,
        child_id: child.id,
        photo_url: photoUrl,
        llm_response: result.feedback,
        status: result.aprovado ? "approved" : "rejected",
      });

      if (result.aprovado) {
        await creditRewards();
        setShowCelebration(true);
        sendLocalNotification(
          `${child.name} completou uma missão!`,
          `${task.name} — +${task.xp_reward} XP, +${task.coins_reward} moedas`
        );
      } else {
        setFeedback(result.feedback);
        setRejected(true);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não consegui verificar a foto. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const creditRewards = async () => {
    if (!st) return;
    await updateStats(child.id, {
      xp_total: st.xp_total + task.xp_reward,
      coins_balance: st.coins_balance + task.coins_reward,
    });
  };

  return (
    <View style={styles.container}>
      <CelebrationOverlay
        visible={showCelebration}
        xp={task.xp_reward}
        coins={task.coins_reward}
        onDone={() => {
          setShowCelebration(false);
          router.back();
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#6B7280"
          />
        </Pressable>
      </View>

      {/* Task info */}
      <View style={styles.taskInfo}>
        <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
          <MaterialCommunityIcons
            name={(task.icon as any) || "star"}
            size={isAngelina ? 64 : 40}
            color={color}
          />
        </View>
        {!isAngelina && (
          <>
            <Text style={styles.taskName}>{task.name}</Text>
            <View style={styles.rewards}>
              <View style={styles.rewardItem}>
                <MaterialCommunityIcons name="star" size={20} color="#22C55E" />
                <Text style={styles.rewardText}>{task.xp_reward} XP</Text>
              </View>
              <View style={styles.rewardItem}>
                <MaterialCommunityIcons
                  name="circle-multiple"
                  size={20}
                  color="#FBBF24"
                />
                <Text style={styles.rewardText}>{task.coins_reward}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Photo area */}
      {task.photo_required ? (
        <View style={styles.photoArea}>
          {photo ? (
            <View style={styles.preview}>
              <Image source={{ uri: photo }} style={styles.previewImage} />
              {!analyzing && !rejected && (
                <Pressable
                  style={styles.retakeBtn}
                  onPress={() => {
                    setPhoto(null);
                    setFeedback(null);
                  }}
                >
                  <Text style={styles.retakeBtnText}>Refazer</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable
              style={[styles.cameraBtn, { borderColor: color }]}
              onPress={handleTakePhoto}
              disabled={attemptsToday >= maxAttempts}
            >
              <MaterialCommunityIcons
                name="camera"
                size={isAngelina ? 80 : 48}
                color={attemptsToday >= maxAttempts ? "#D1D5DB" : color}
              />
              {!isAngelina && (
                <Text
                  style={[
                    styles.cameraBtnText,
                    { color: attemptsToday >= maxAttempts ? "#D1D5DB" : color },
                  ]}
                >
                  {attemptsToday >= maxAttempts
                    ? "Tentativas esgotadas hoje"
                    : "Tirar Foto"}
                </Text>
              )}
            </Pressable>
          )}

          {/* Feedback */}
          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                { backgroundColor: rejected ? "#FEF2F2" : "#F0FDF4" },
              ]}
            >
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          )}

          {/* Action buttons */}
          {photo && !analyzing && (
            <View style={styles.actions}>
              {rejected ? (
                <Pressable
                  style={[styles.submitBtn, { backgroundColor: color }]}
                  onPress={handleTakePhoto}
                  disabled={attemptsToday >= maxAttempts}
                >
                  <Text style={styles.submitBtnText}>
                    Tentar novamente ({maxAttempts - attemptsToday} restantes)
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.submitBtn, { backgroundColor: color }]}
                  onPress={handleSubmitPhoto}
                >
                  <MaterialCommunityIcons
                    name="send"
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.submitBtnText}>
                    {isAngelina ? "✔" : "Enviar para verificação"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {analyzing && (
            <View style={styles.analyzingBox}>
              <ActivityIndicator size="large" color={color} />
              <Text style={[styles.analyzingText, { color }]}>
                {isAngelina ? "🔍..." : "Verificando sua missão..."}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noPhotoArea}>
          <Pressable
            style={[styles.completeBtn, { backgroundColor: color }]}
            onPress={handleNoPhotoComplete}
          >
            {isAngelina ? (
              <MaterialCommunityIcons name="check" size={64} color="#FFF" />
            ) : (
              <Text style={styles.completeBtnText}>Marcar como feita ✓</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Helper to decode base64 to Uint8Array for Supabase upload
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F0" },
  header: { paddingTop: 56, paddingHorizontal: 24 },
  taskInfo: { alignItems: "center", paddingHorizontal: 24, marginTop: 16 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  taskName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 12,
    textAlign: "center",
  },
  rewards: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  rewardItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  rewardText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  photoArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
  },
  cameraBtn: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtnText: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  preview: { width: "100%", borderRadius: 16, overflow: "hidden" },
  previewImage: { width: "100%", height: 250, borderRadius: 16 },
  retakeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retakeBtnText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  feedbackBox: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  feedbackText: { fontSize: 15, color: "#374151", textAlign: "center" },
  actions: { width: "100%", marginTop: 16 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  analyzingBox: { alignItems: "center", marginTop: 24 },
  analyzingText: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  noPhotoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  completeBtn: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  completeBtnText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
});
