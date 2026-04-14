import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
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

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeChild, activeStats, updateStats } = useChildStore();
  const { tasks, createCompletion, getTodayCompletionsCount, completions } = useTaskStore();

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
      <View style={styles.container}><Text style={{ color: "#6B7280", textAlign: "center", marginTop: 100 }}>Tarefa nao encontrada</Text></View>
    );
  }

  const color = child.theme_color;
  const isAngelina = child.age < 6;
  const attemptsToday = getTodayCompletionsCount(task.id, child.id);
  const maxAttempts = 3;

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permissao necessaria", "Precisamos da camera."); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true, allowsEditing: false });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 ?? null);
      setFeedback(null);
      setRejected(false);
    }
  };

  const handleNoPhotoComplete = async () => {
    const completion = await createCompletion({
      task_id: task.id, child_id: child.id,
      photo_url: null, llm_response: null, status: "approved",
    });
    if (completion) {
      await creditRewards();
      setShowCelebration(true);
      sendLocalNotification(`${child.name} completou uma missao!`, `${task.name} — +${task.xp_reward} XP, +${task.coins_reward} moedas`);
    }
  };

  const handleSubmitPhoto = async () => {
    if (!photo || !photoBase64) return;
    setAnalyzing(true); setFeedback(null); setRejected(false);
    try {
      const base64 = photoBase64;
      const fileName = `${child.id}/${task.id}_${Date.now()}.jpg`;
      const { data: uploadData } = await supabase.storage.from("task-photos").upload(fileName, decode(base64), { contentType: "image/jpeg" });
      const photoUrl = uploadData?.path ? supabase.storage.from("task-photos").getPublicUrl(uploadData.path).data.publicUrl : null;
      const result = await analyzeTaskPhoto(base64, task.name, task.llm_criteria || "");
      await createCompletion({
        task_id: task.id, child_id: child.id,
        photo_url: photoUrl, llm_response: result.feedback,
        status: result.aprovado ? "approved" : "rejected",
      });
      if (result.aprovado) {
        await creditRewards();
        setShowCelebration(true);
        sendLocalNotification(`${child.name} completou uma missao!`, `${task.name} — +${task.xp_reward} XP, +${task.coins_reward} moedas`);
      } else {
        setFeedback(result.feedback);
        setRejected(true);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Nao consegui verificar a foto. Tente novamente.");
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
        onDone={() => { setShowCelebration(false); router.back(); }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#39FF14" />
          </Pressable>
        </View>

        {/* Task info */}
        <View style={styles.taskInfo}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name={(task.icon as any) || "star"} size={isAngelina ? 56 : 36} color="#39FF14" />
          </View>
          {!isAngelina && (
            <>
              <Text style={styles.taskName}>{task.name}</Text>
              <View style={styles.rewards}>
                <View style={styles.rewardBadge}>
                  <MaterialCommunityIcons name="star" size={16} color="#39FF14" />
                  <Text style={styles.rewardXP}>{task.xp_reward} XP</Text>
                </View>
                <View style={[styles.rewardBadge, { backgroundColor: "rgba(245,158,11,0.1)" }]}>
                  <MaterialCommunityIcons name="circle-multiple" size={16} color="#F59E0B" />
                  <Text style={[styles.rewardXP, { color: "#92400E" }]}>{task.coins_reward}</Text>
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
                  <Pressable style={styles.retakeBtn} onPress={() => { setPhoto(null); setFeedback(null); }}>
                    <Text style={styles.retakeBtnText}>Refazer</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <Pressable
                style={[styles.cameraBtn, attemptsToday >= maxAttempts && { borderColor: "#E5E7EB" }]}
                onPress={handleTakePhoto}
                disabled={attemptsToday >= maxAttempts}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={isAngelina ? 72 : 44}
                  color={attemptsToday >= maxAttempts ? "#D1D5DB" : "#39FF14"}
                />
                {!isAngelina && (
                  <Text style={[styles.cameraBtnText, attemptsToday >= maxAttempts && { color: "#D1D5DB" }]}>
                    {attemptsToday >= maxAttempts ? "Tentativas esgotadas hoje" : "Tirar Foto"}
                  </Text>
                )}
              </Pressable>
            )}

            {feedback && (
              <View style={[styles.feedbackBox, { backgroundColor: rejected ? "#FEF2F2" : "#F0FDF4", borderColor: rejected ? "rgba(239,68,68,0.2)" : "rgba(57,255,20,0.2)" }]}>
                <Text style={[styles.feedbackText, { color: rejected ? "#DC2626" : "#16A34A" }]}>{feedback}</Text>
              </View>
            )}

            {photo && !analyzing && (
              <View style={styles.actions}>
                {rejected ? (
                  <Pressable
                    style={[styles.submitBtn, { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#EF4444" }]}
                    onPress={handleTakePhoto}
                    disabled={attemptsToday >= maxAttempts}
                  >
                    <Text style={[styles.submitBtnText, { color: "#EF4444" }]}>
                      Tentar novamente ({maxAttempts - attemptsToday} restantes)
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.submitBtn} onPress={handleSubmitPhoto}>
                    <MaterialCommunityIcons name="send" size={18} color="#FFF" />
                    <Text style={styles.submitBtnText}>
                      {isAngelina ? "✔" : "Enviar para verificacao"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {analyzing && (
              <View style={styles.analyzingBox}>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={styles.analyzingText}>
                  {isAngelina ? "🔍..." : "Verificando sua missao..."}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noPhotoArea}>
            <Pressable style={styles.completeBtn} onPress={handleNoPhotoComplete}>
              {isAngelina ? (
                <MaterialCommunityIcons name="check" size={56} color="#FFF" />
              ) : (
                <Text style={styles.completeBtnText}>Marcar como feita ✓</Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingTop: 56, paddingHorizontal: 24 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(57,255,20,0.08)",
    justifyContent: "center", alignItems: "center",
  },

  taskInfo: { alignItems: "center", paddingHorizontal: 24, marginTop: 24 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#39FF14",
    shadowColor: "#39FF14", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 16,
  },
  taskName: { fontSize: 24, fontWeight: "800", color: "#111827", marginTop: 16, textAlign: "center", letterSpacing: -0.5 },
  rewards: { flexDirection: "row", gap: 12, marginTop: 12 },
  rewardBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(57,255,20,0.08)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  rewardXP: { fontSize: 15, fontWeight: "700", color: "#16A34A" },

  photoArea: { flex: 1, paddingHorizontal: 24, paddingTop: 28, alignItems: "center" },
  cameraBtn: {
    width: "100%", height: 200, borderRadius: 20,
    borderWidth: 3, borderStyle: "dashed", borderColor: "#39FF14",
    justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF",
  },
  cameraBtnText: { fontSize: 15, fontWeight: "600", marginTop: 8, color: "#6B7280" },
  preview: { width: "100%", borderRadius: 16, overflow: "hidden" },
  previewImage: { width: "100%", height: 250, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  retakeBtn: {
    position: "absolute", top: 10, right: 10,
    backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  retakeBtnText: { color: "#39FF14", fontSize: 13, fontWeight: "700" },

  feedbackBox: {
    width: "100%", padding: 16, borderRadius: 14, marginTop: 14,
    borderWidth: 1,
  },
  feedbackText: { fontSize: 14, fontWeight: "500", textAlign: "center" },

  actions: { width: "100%", marginTop: 16 },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, padding: 16, borderRadius: 14,
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  analyzingBox: { alignItems: "center", marginTop: 28 },
  analyzingText: { fontSize: 15, fontWeight: "600", marginTop: 12, color: "#39FF14" },

  noPhotoArea: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingTop: 40 },
  completeBtn: {
    width: "100%", padding: 20, borderRadius: 20, alignItems: "center",
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  completeBtnText: { color: "#FFF", fontSize: 20, fontWeight: "800" },
});
