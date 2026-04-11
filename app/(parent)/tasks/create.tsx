import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../stores/authStore";
import { useTaskStore } from "../../../stores/taskStore";
import { useChildStore } from "../../../stores/childStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TASK_ICONS } from "../../../types";
import type { TaskType, Recurrence } from "../../../types";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CreateTask() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { createTask } = useTaskStore();
  const { children } = useChildStore();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("star");
  const [type, setType] = useState<TaskType>("casa");
  const [recurrence, setRecurrence] = useState<Recurrence>("diaria");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [xpReward, setXpReward] = useState(10);
  const [coinsReward, setCoinsReward] = useState(5);
  const [photoRequired, setPhotoRequired] = useState(true);
  const [llmCriteria, setLlmCriteria] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite o nome da tarefa");
      return;
    }
    if (!user) return;

    setLoading(true);
    await createTask({
      name: name.trim(),
      icon,
      type,
      recurrence,
      days_of_week: recurrence === "semanal" ? daysOfWeek : null,
      due_date: null,
      xp_reward: xpReward,
      coins_reward: coinsReward,
      photo_required: photoRequired,
      llm_criteria: photoRequired ? llmCriteria || null : null,
      assigned_to: assignedTo,
      created_by: user.id,
    });
    setLoading(false);
    router.back();
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Cancelar</Text>
        </Pressable>
        <Text style={styles.title}>Nova Tarefa</Text>
        <Pressable onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, loading && { opacity: 0.5 }]}>
            Salvar
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Arrumar a cama"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Ícone</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {TASK_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => setIcon(ic)}
              style={[
                styles.iconOption,
                icon === ic && styles.iconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name={ic as any}
                size={28}
                color={icon === ic ? "#3B82F6" : "#9CA3AF"}
              />
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.row}>
          {(["casa", "escola", "desafio"] as TaskType[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.chip, type === t && styles.chipSelected]}
              onPress={() => setType(t)}
            >
              <Text
                style={[
                  styles.chipText,
                  type === t && styles.chipTextSelected,
                ]}
              >
                {t === "casa" ? "🏠 Casa" : t === "escola" ? "📚 Escola" : "⚡ Desafio"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Recorrência</Text>
        <View style={styles.row}>
          {(["diaria", "semanal", "unica"] as Recurrence[]).map((r) => (
            <Pressable
              key={r}
              style={[styles.chip, recurrence === r && styles.chipSelected]}
              onPress={() => setRecurrence(r)}
            >
              <Text
                style={[
                  styles.chipText,
                  recurrence === r && styles.chipTextSelected,
                ]}
              >
                {r === "diaria"
                  ? "Diária"
                  : r === "semanal"
                  ? "Semanal"
                  : "Única"}
              </Text>
            </Pressable>
          ))}
        </View>

        {recurrence === "semanal" && (
          <>
            <Text style={styles.label}>Dias da Semana</Text>
            <View style={styles.row}>
              {DAYS.map((day, i) => (
                <Pressable
                  key={day}
                  style={[
                    styles.dayChip,
                    daysOfWeek.includes(i) && styles.daySelected,
                  ]}
                  onPress={() => toggleDay(i)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      daysOfWeek.includes(i) && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>Atribuir a</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.chip, !assignedTo && styles.chipSelected]}
            onPress={() => setAssignedTo(null)}
          >
            <Text
              style={[
                styles.chipText,
                !assignedTo && styles.chipTextSelected,
              ]}
            >
              Todos
            </Text>
          </Pressable>
          {children.map((child) => (
            <Pressable
              key={child.id}
              style={[
                styles.chip,
                assignedTo === child.id && {
                  backgroundColor: child.theme_color,
                  borderColor: child.theme_color,
                },
              ]}
              onPress={() => setAssignedTo(child.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  assignedTo === child.id && { color: "#FFF" },
                ]}
              >
                {child.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>XP: {xpReward}</Text>
        <View style={styles.sliderRow}>
          <Pressable
            onPress={() => setXpReward(Math.max(1, xpReward - 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>-</Text>
          </Pressable>
          <View style={[styles.sliderBar, { flex: 1 }]}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${(xpReward / 100) * 100}%`,
                  backgroundColor: "#22C55E",
                },
              ]}
            />
          </View>
          <Pressable
            onPress={() => setXpReward(Math.min(100, xpReward + 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Moedas: {coinsReward}</Text>
        <View style={styles.sliderRow}>
          <Pressable
            onPress={() => setCoinsReward(Math.max(1, coinsReward - 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>-</Text>
          </Pressable>
          <View style={[styles.sliderBar, { flex: 1 }]}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${(coinsReward / 50) * 100}%`,
                  backgroundColor: "#FBBF24",
                },
              ]}
            />
          </View>
          <Pressable
            onPress={() => setCoinsReward(Math.min(50, coinsReward + 5))}
            style={styles.sliderBtn}
          >
            <Text style={styles.sliderBtnText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Foto obrigatória?</Text>
          <Switch
            value={photoRequired}
            onValueChange={setPhotoRequired}
            trackColor={{ true: "#3B82F6" }}
          />
        </View>

        {photoRequired && (
          <>
            <Text style={styles.label}>Critérios para a LLM</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Ex: A cama deve estar com lençol esticado, travesseiro arrumado e sem roupas em cima"
              value={llmCriteria}
              onChangeText={setLlmCriteria}
              multiline
              placeholderTextColor="#9CA3AF"
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backText: { fontSize: 16, color: "#EF4444" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  saveText: { fontSize: 16, color: "#3B82F6", fontWeight: "700" },
  scroll: { flex: 1, paddingHorizontal: 24 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  chipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  chipText: { fontSize: 14, color: "#374151" },
  chipTextSelected: { color: "#FFF", fontWeight: "600" },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  daySelected: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  dayText: { fontSize: 12, color: "#374151" },
  dayTextSelected: { color: "#FFF", fontWeight: "700" },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconSelected: { borderColor: "#3B82F6", backgroundColor: "#EFF6FF" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  sliderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderBtnText: { fontSize: 20, fontWeight: "bold", color: "#374151" },
  sliderBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: { height: "100%", borderRadius: 4 },
});
