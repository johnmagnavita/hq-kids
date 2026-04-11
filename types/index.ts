export type TaskType = "casa" | "escola" | "desafio";
export type Recurrence = "diaria" | "semanal" | "unica";
export type CompletionStatus = "pending" | "approved" | "rejected";
export type RedemptionStatus = "pending" | "delivered";

export interface Child {
  id: string;
  name: string;
  avatar_url: string | null;
  theme_color: string;
  age: number;
  parent_id: string;
}

export interface ChildStats {
  id: string;
  child_id: string;
  xp_total: number;
  coins_balance: number;
  streak_current: number;
  streak_max: number;
  level: number;
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  type: TaskType;
  recurrence: Recurrence;
  days_of_week: number[] | null;
  due_date: string | null;
  xp_reward: number;
  coins_reward: number;
  photo_required: boolean;
  llm_criteria: string | null;
  assigned_to: string | null; // null = todos
  created_by: string;
  created_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  child_id: string;
  photo_url: string | null;
  llm_response: string | null;
  status: CompletionStatus;
  completed_at: string;
  task?: Task;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  cost_coins: number;
  available_to: string | null; // null = todos
  created_by: string;
}

export interface RewardRedemption {
  id: string;
  reward_id: string;
  child_id: string;
  status: RedemptionStatus;
  redeemed_at: string;
  reward?: Reward;
}

export interface LLMAnalysisResult {
  aprovado: boolean;
  feedback: string;
}

export const LEVELS = [
  { level: 1, name: "Recruta", xp: 0 },
  { level: 2, name: "Aprendiz", xp: 100 },
  { level: 3, name: "Aventureiro", xp: 300 },
  { level: 4, name: "Herói", xp: 600 },
  { level: 5, name: "Campeão", xp: 1000 },
  { level: 6, name: "Lenda", xp: 1500 },
] as const;

export type LevelEntry = (typeof LEVELS)[number];

export function getLevelInfo(xp: number) {
  let current: LevelEntry = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xp) current = lvl;
    else break;
  }
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next: LevelEntry | null =
    nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
  const progressToNext = next
    ? (xp - current.xp) / (next.xp - current.xp)
    : 1;
  return { level: current.level, name: current.name, xp: current.xp, next, progressToNext };
}

export const CHILD_THEMES: Record<string, string> = {
  otavio: "#3B82F6",
  nicolle: "#A855F7",
  angelina: "#F472B6",
};

export const TASK_ICONS = [
  "bed",
  "broom",
  "book-open-variant",
  "tooth",
  "silverware-fork-knife",
  "dog",
  "flower",
  "trash-can",
  "tshirt-crew",
  "pencil",
  "calculator",
  "run",
  "basketball",
  "music",
  "palette",
  "star",
  "heart",
  "puzzle",
  "gamepad-variant",
  "clock",
] as const;
