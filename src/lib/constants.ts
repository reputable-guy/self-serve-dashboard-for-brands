// Centralized constants for categories, devices, and metrics

export const CATEGORIES = [
  { value: "sleep", label: "Sleep & Recovery" },
  { value: "stress", label: "Stress & Mood" },
  { value: "energy", label: "Energy & Focus" },
  { value: "fitness", label: "Fitness & Performance" },
  { value: "nutrition", label: "Nutrition & Gut Health" },
  { value: "longevity", label: "Longevity & Anti-Aging" },
  { value: "immunity", label: "Immunity & Wellness" },
  { value: "cognitive", label: "Cognitive & Brain Health" },
  { value: "skin", label: "Skin & Beauty" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

// Simple category names for display (backwards compatible)
export const CATEGORY_LABELS: Record<string, string> = {
  sleep: "Sleep & Recovery",
  stress: "Stress & Mood",
  energy: "Energy & Focus",
  fitness: "Fitness & Performance",
  nutrition: "Nutrition & Gut Health",
  longevity: "Longevity & Anti-Aging",
  immunity: "Immunity & Wellness",
  cognitive: "Cognitive & Brain Health",
  skin: "Skin & Beauty",
  // Legacy mappings for old category values
  Sleep: "Sleep & Recovery",
  Stress: "Stress & Mood",
  Energy: "Energy & Focus",
  Recovery: "Sleep & Recovery",
  Fitness: "Fitness & Performance",
  Nutrition: "Nutrition & Gut Health",
  Skin: "Skin & Beauty",
};

export const DEVICES = [
  { value: "any", label: "Any Device" },
  { value: "oura", label: "Oura Ring" },
  { value: "whoop", label: "Whoop" },
  { value: "apple", label: "Apple Watch" },
  { value: "garmin", label: "Garmin" },
  { value: "fitbit", label: "Fitbit" },
] as const;

export type DeviceValue = (typeof DEVICES)[number]["value"];

export const DEVICE_LABELS: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

export const METRICS = [
  { id: "sleep-quality", label: "Sleep Quality", icon: "💤" },
  { id: "deep-sleep", label: "Deep Sleep", icon: "🌙" },
  { id: "rem-sleep", label: "REM Sleep", icon: "😴" },
  { id: "hrv", label: "HRV (Heart Rate Variability)", icon: "💓" },
  { id: "resting-heart-rate", label: "Resting Heart Rate", icon: "❤️" },
  { id: "stress", label: "Stress", icon: "😰" },
  { id: "recovery-score", label: "Recovery Score", icon: "🔋" },
  { id: "steps", label: "Steps", icon: "👣" },
  { id: "energy", label: "Energy", icon: "⚡" },
] as const;

export type MetricId = (typeof METRICS)[number]["id"];

// Default days for villain variable questions
export const DEFAULT_VILLAIN_DAYS = [7, 14, 21, 28] as const;

// Study status definitions
export const STUDY_STATUSES = {
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
  recruiting: { bg: "bg-[#00D1C1]/20", text: "text-[#00D1C1]", label: "Recruiting" },
  "filling-fast": { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Filling Fast" },
  full: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Full" },
  completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed" },
} as const;

export type StudyStatus = keyof typeof STUDY_STATUSES;
