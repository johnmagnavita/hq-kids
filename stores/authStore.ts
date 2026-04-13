import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { Child } from "../types";

type UserRole = "parent" | "child" | null;

const PIN_STORAGE_KEY = "hqkids_parent_pin";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: UserRole;
  childProfile: Child | null;
  isParentMode: boolean;
  loading: boolean;
  pin: string;
  pinReady: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  detectRole: () => Promise<void>;
  enterParentMode: (pin: string) => boolean;
  exitParentMode: () => void;
  setPin: (pin: string) => Promise<void>;
  loadPin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  childProfile: null,
  isParentMode: false,
  loading: true,
  pin: "",
  pinReady: false,

  loadPin: async () => {
    const stored = await AsyncStorage.getItem(PIN_STORAGE_KEY);
    set({ pin: stored || "", pinReady: true });
  },

  initialize: async () => {
    await get().loadPin();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null });

    if (session?.user) {
      await get().detectRole();
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await get().detectRole();
      } else {
        set({ role: null, childProfile: null });
      }
    });
  },

  detectRole: async () => {
    const user = get().user;
    if (!user) return;

    // Check if this user is linked as a child
    const { data: childData } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (childData) {
      set({ role: "child", childProfile: childData as Child });
      return;
    }

    // Check if this user has children (is a parent)
    const { data: parentData } = await supabase
      .from("children")
      .select("id")
      .eq("parent_id", user.id)
      .limit(1);

    if (parentData && parentData.length > 0) {
      set({ role: "parent", childProfile: null });
      return;
    }

    // New user — default to parent
    set({ role: "parent", childProfile: null });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      throw error;
    }
    set({ loading: false });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ loading: false });
      throw error;
    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      role: null,
      childProfile: null,
      isParentMode: false,
    });
  },

  enterParentMode: (pin) => {
    if (pin === get().pin) {
      set({ isParentMode: true });
      return true;
    }
    return false;
  },

  exitParentMode: () => set({ isParentMode: false }),

  setPin: async (pin) => {
    await AsyncStorage.setItem(PIN_STORAGE_KEY, pin);
    set({ pin });
  },
}));
