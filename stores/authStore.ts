import { create } from "zustand";
import { supabase } from "../services/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  isParentMode: boolean;
  loading: boolean;
  pin: string;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  enterParentMode: (pin: string) => boolean;
  exitParentMode: () => void;
  setPin: (pin: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isParentMode: false,
  loading: true,
  pin: "1234", // default PIN

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ loading: false });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isParentMode: false });
  },

  enterParentMode: (pin) => {
    if (pin === get().pin) {
      set({ isParentMode: true });
      return true;
    }
    return false;
  },

  exitParentMode: () => set({ isParentMode: false }),

  setPin: (pin) => set({ pin }),
}));
