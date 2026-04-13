import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../stores/authStore";
import { useChildStore } from "../../stores/childStore";
import { supabase } from "../../services/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Child } from "../../types";

const THEME_COLORS = [
  "#3B82F6",
  "#A855F7",
  "#F472B6",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#6366F1",
];

export default function ManageChildren() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { children, fetchChildren } = useChildStore();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchChildren(user.id);
  }, [user]);

  const handleAddChild = async () => {
    if (!name.trim() || !age.trim() || !user) {
      Alert.alert("Erro", "Preencha nome e idade");
      return;
    }

    setSaving(true);

    // If email provided, find the user_id
    let userId: string | null = null;
    if (email.trim()) {
      const { data: userData } = await supabase
        .from("auth_users_view")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .single();

      // Try via admin query
      if (!userData) {
        // Look up directly
        const res = await supabase.rpc("find_user_by_email", {
          p_email: email.trim().toLowerCase(),
        });
        if (res.data) userId = res.data;
      } else {
        userId = userData.id;
      }
    }

    // Create child profile
    const { data: childData, error } = await supabase
      .from("children")
      .insert({
        name: name.trim(),
        age: parseInt(age),
        theme_color: color,
        parent_id: user.id,
        user_id: userId,
        email: email.trim() || null,
        role: "child",
      })
      .select()
      .single();

    if (error) {
      Alert.alert("Erro", error.message);
      setSaving(false);
      return;
    }

    // Create stats for child
    if (childData) {
      await supabase.from("child_stats").insert({
        child_id: childData.id,
        xp_total: 0,
        coins_balance: 0,
        streak_current: 0,
        streak_max: 0,
        level: 1,
      });
    }

    setSaving(false);
    setShowAdd(false);
    setName("");
    setAge("");
    setEmail("");
    if (user) fetchChildren(user.id);
    Alert.alert("Filho adicionado! 🎉");
  };

  const handleLinkEmail = async (child: Child) => {
    Alert.prompt(
      "Vincular email",
      `Digite o email da conta do(a) ${child.name}:`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Vincular",
          onPress: async (emailInput: string | undefined) => {
            if (!emailInput?.trim()) return;

            // Find user by email
            const { data } = await supabase.rpc("find_user_by_email", {
              p_email: emailInput.trim().toLowerCase(),
            });

            if (data) {
              await supabase
                .from("children")
                .update({
                  user_id: data,
                  email: emailInput.trim().toLowerCase(),
                })
                .eq("id", child.id);

              if (user) fetchChildren(user.id);
              Alert.alert("Vinculado!", `${child.name} agora pode fazer login com ${emailInput}`);
            } else {
              Alert.alert(
                "Usuário não encontrado",
                "O filho(a) precisa criar uma conta primeiro no app (botão 'Entrar como Filho')."
              );
            }
          },
        },
      ],
      "plain-text",
      child.email || ""
    );
  };

  const handleChangePhoto = async (child: Child) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]?.base64) return;

    const base64 = result.assets[0].base64;
    const fileName = `avatars/${child.id}_${Date.now()}.jpg`;

    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from("task-photos")
      .upload(fileName, bytes, { contentType: "image/jpeg", upsert: true });

    if (uploadError) {
      Alert.alert("Erro", "Não consegui enviar a foto.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("task-photos")
      .getPublicUrl(fileName);

    await supabase
      .from("children")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", child.id);

    if (user) fetchChildren(user.id);
    Alert.alert("Foto atualizada! 📸");
  };

  const handleDeleteChild = (child: Child) => {
    Alert.alert("Remover", `Remover ${child.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await supabase.from("child_stats").delete().eq("child_id", child.id);
          await supabase.from("children").delete().eq("id", child.id);
          if (user) fetchChildren(user.id);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Gerenciar Filhos</Text>
        <Pressable onPress={() => setShowAdd(!showAdd)}>
          <MaterialCommunityIcons
            name={showAdd ? "close" : "plus-circle"}
            size={28}
            color="#3B82F6"
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Add child form */}
        {showAdd && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Adicionar Filho(a)</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={styles.input}
              placeholder="Email do filho(a) (opcional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Cor</Text>
            <View style={styles.colorRow}>
              {THEME_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    color === c && styles.colorDotSelected,
                  ]}
                />
              ))}
            </View>

            <Pressable
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleAddChild}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>Adicionar</Text>
            </Pressable>
          </View>
        )}

        {/* Children list */}
        {children.map((child) => (
          <View
            key={child.id}
            style={[styles.childCard, { borderLeftColor: child.theme_color }]}
          >
            <View style={styles.childHeader}>
              <Pressable
                onPress={() => handleChangePhoto(child)}
                style={{ position: "relative" }}
              >
                {child.avatar_url ? (
                  <Image
                    source={{ uri: child.avatar_url }}
                    style={[styles.avatar, { backgroundColor: child.theme_color }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: child.theme_color },
                    ]}
                  >
                    <Text style={styles.avatarText}>
                      {child.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={12}
                    color="#FFF"
                  />
                </View>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>{child.age} anos</Text>
                {child.email ? (
                  <View style={styles.linkedRow}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#22C55E"
                    />
                    <Text style={styles.linkedText}>{child.email}</Text>
                  </View>
                ) : (
                  <View style={styles.linkedRow}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={14}
                      color="#FBBF24"
                    />
                    <Text style={styles.unlinkedText}>Sem conta vinculada</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.childActions}>
              {!child.email && (
                <Pressable
                  style={styles.linkBtn}
                  onPress={() => handleLinkEmail(child)}
                >
                  <MaterialCommunityIcons
                    name="link"
                    size={16}
                    color="#3B82F6"
                  />
                  <Text style={styles.linkBtnText}>Vincular Email</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.deleteBtn}
                onPress={() => handleDeleteChild(child)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color="#EF4444"
                />
              </Pressable>
            </View>
          </View>
        ))}

        {children.length === 0 && !showAdd && (
          <Text style={styles.empty}>
            Nenhum filho cadastrado. Toque no + para adicionar.
          </Text>
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
  backText: { fontSize: 16, color: "#3B82F6" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  scroll: { flex: 1, paddingHorizontal: 24 },
  addForm: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: "#1F2937",
  },
  saveBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  childCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  cameraIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  childName: { fontSize: 17, fontWeight: "700", color: "#1F2937" },
  childAge: { fontSize: 13, color: "#6B7280" },
  linkedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  linkedText: { fontSize: 12, color: "#22C55E" },
  unlinkedText: { fontSize: 12, color: "#FBBF24" },
  childActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkBtnText: { fontSize: 13, color: "#3B82F6", fontWeight: "600" },
  deleteBtn: {
    padding: 6,
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
  },
});
