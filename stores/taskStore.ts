import { create } from "zustand";
import { supabase } from "../services/supabase";
import type { Task, TaskCompletion } from "../types";

interface TaskState {
  tasks: Task[];
  completions: TaskCompletion[];
  loading: boolean;

  fetchTasks: (parentId: string) => Promise<void>;
  fetchTasksForChild: (childId: string) => Promise<void>;
  fetchCompletions: (childId: string, date?: string) => Promise<void>;
  createTask: (task: Omit<Task, "id" | "created_at">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createCompletion: (
    completion: Omit<TaskCompletion, "id" | "completed_at" | "task">
  ) => Promise<TaskCompletion | null>;
  updateCompletion: (
    id: string,
    updates: Partial<TaskCompletion>
  ) => Promise<void>;
  getTodayCompletionsCount: (taskId: string, childId: string) => number;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  completions: [],
  loading: false,

  fetchTasks: async (parentId) => {
    set({ loading: true });
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("created_by", parentId)
      .order("created_at", { ascending: false });

    if (data) set({ tasks: data as Task[] });
    set({ loading: false });
  },

  fetchTasksForChild: async (childId) => {
    set({ loading: true });
    const today = new Date();
    const dayOfWeek = today.getDay();

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .or(`assigned_to.eq.${childId},assigned_to.is.null`)
      .order("type");

    if (data) {
      const filtered = (data as Task[]).filter((task) => {
        if (task.recurrence === "diaria") return true;
        if (task.recurrence === "semanal") {
          return task.days_of_week?.includes(dayOfWeek) ?? false;
        }
        if (task.recurrence === "unica") {
          if (!task.due_date) return true;
          return new Date(task.due_date) >= today;
        }
        return true;
      });
      set({ tasks: filtered });
    }
    set({ loading: false });
  },

  fetchCompletions: async (childId, date) => {
    const targetDate = date || todayISO();
    const { data } = await supabase
      .from("task_completions")
      .select("*, task:tasks(*)")
      .eq("child_id", childId)
      .gte("completed_at", `${targetDate}T00:00:00`)
      .lte("completed_at", `${targetDate}T23:59:59`);

    if (data) set({ completions: data as TaskCompletion[] });
  },

  createTask: async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ tasks: [data as Task, ...state.tasks] }));
    }
  },

  updateTask: async (id, updates) => {
    const { error } = await supabase.from("tasks").update(updates).eq("id", id);
    if (!error) {
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    }
  },

  deleteTask: async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  createCompletion: async (completion) => {
    const { data, error } = await supabase
      .from("task_completions")
      .insert({ ...completion, completed_at: new Date().toISOString() })
      .select("*, task:tasks(*)")
      .single();

    if (!error && data) {
      const tc = data as TaskCompletion;
      set((state) => ({ completions: [...state.completions, tc] }));
      return tc;
    }
    return null;
  },

  updateCompletion: async (id, updates) => {
    await supabase.from("task_completions").update(updates).eq("id", id);
    set((state) => ({
      completions: state.completions.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  getTodayCompletionsCount: (taskId, childId) => {
    const today = todayISO();
    return get().completions.filter(
      (c) =>
        c.task_id === taskId &&
        c.child_id === childId &&
        c.completed_at.startsWith(today)
    ).length;
  },
}));
