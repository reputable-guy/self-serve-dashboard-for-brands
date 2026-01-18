/**
 * Constants for categories, devices, and metrics
 *
 * NOTE: Categories are now defined in categories.ts as the single source of truth.
 * This file re-exports them for backwards compatibility.
 */

// Re-export categories from single source of truth
export {
  CATEGORIES,
  CATEGORIES_LEGACY,
  CATEGORY_LABELS,
  getCategory,
  getCategoryLabel,
  getCategoriesByTier,
  categorySupportsWearables,
  isHigherBetter,
  shouldShowWearableData,
} from "./categories";

// Re-export types
export type { CategoryValue, TierLevel } from "./types";

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
  active: { bg: "bg-green-500/20", text: "text-green-400", label: "Active" },
  archived: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Archived" },
} as const;

export type StudyStatus = keyof typeof STUDY_STATUSES;
