import { create } from "zustand";
import { supabase } from "../services/supabase";
import type { Child, ChildStats } from "../types";

interface ChildState {
  children: Child[];
  stats: Record<string, ChildStats>;
  activeChildId: string | null;
  loading: boolean;

  activeChild: () => Child | null;
  activeStats: () => ChildStats | null;
  fetchChildren: (parentId: string) => Promise<void>;
  fetchStats: (childId: string) => Promise<void>;
  fetchAllStats: () => Promise<void>;
  setActiveChild: (id: string) => void;
  updateStats: (
    childId: string,
    updates: Partial<ChildStats>
  ) => Promise<void>;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  stats: {},
  activeChildId: null,
  loading: false,

  activeChild: () => {
    const { children, activeChildId } = get();
    return children.find((c) => c.id === activeChildId) ?? null;
  },

  activeStats: () => {
    const { stats, activeChildId } = get();
    return activeChildId ? stats[activeChildId] ?? null : null;
  },

  fetchChildren: async (parentId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", parentId)
      .order("name");

    if (!error && data) {
      set({ children: data as Child[], loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchStats: async (childId) => {
    const { data } = await supabase
      .from("child_stats")
      .select("*")
      .eq("child_id", childId)
      .single();

    if (data) {
      set((state) => ({
        stats: { ...state.stats, [childId]: data as ChildStats },
      }));
    }
  },

  fetchAllStats: async () => {
    const { children } = get();
    await Promise.all(children.map((c) => get().fetchStats(c.id)));
  },

  setActiveChild: (id) => set({ activeChildId: id }),

  updateStats: async (childId, updates) => {
    const { error } = await supabase
      .from("child_stats")
      .update(updates)
      .eq("child_id", childId);

    if (!error) {
      set((state) => ({
        stats: {
          ...state.stats,
          [childId]: { ...state.stats[childId], ...updates } as ChildStats,
        },
      }));
    }
  },
}));
