// Profile questions configuration
// These are platform-wide questions asked to build participant profiles
// They are collected progressively (one per day) during a participant's first study

export interface ProfileQuestion {
  id: string;
  questionText: string;
  questionType: "multiple_choice" | "likert_scale" | "text";
  options?: string[];
  collectOnDay: number; // Which day of the study to ask this question
  fieldKey: string; // The profile field this populates
  required: boolean;
}

export interface ParticipantProfile {
  id: string;

  // Core demographics (collected progressively)
  ageRange?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
  lifeStage?: "student" | "early-career" | "parent" | "established-professional" | "retired";
  primaryWellnessGoal?: string;
  baselineStressLevel?: number; // 1-10

  // Derived from wearables (never ask, auto-populated)
  connectedDevices: string[];
  activityLevel?: "sedentary" | "lightly-active" | "moderately-active" | "very-active";
  avgSleepDuration?: number; // minutes
  avgHrv?: number;

  // Metadata
  profileCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Default profile questions - these are asked progressively during first study
export const DEFAULT_PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: "age-range",
    questionText: "Quick question: what's your age range?",
    questionType: "multiple_choice",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    collectOnDay: 1,
    fieldKey: "ageRange",
    required: true,
  },
  {
    id: "life-stage",
    questionText: "Which best describes your current life stage?",
    questionType: "multiple_choice",
    options: [
      "Student",
      "Early career professional",
      "Parent with young children",
      "Established professional",
      "Retired or semi-retired",
    ],
    collectOnDay: 2,
    fieldKey: "lifeStage",
    required: true,
  },
  {
    id: "wellness-goal",
    questionText: "What's your #1 wellness goal right now?",
    questionType: "text",
    collectOnDay: 3,
    fieldKey: "primaryWellnessGoal",
    required: true,
  },
  {
    id: "stress-level",
    questionText: "On a typical day, how would you rate your stress level?",
    questionType: "likert_scale",
    collectOnDay: 5,
    fieldKey: "baselineStressLevel",
    required: true,
  },
];

// Storage key for profile questions in localStorage
const PROFILE_QUESTIONS_STORAGE_KEY = "reputable-profile-questions";

// Load profile questions from localStorage or return defaults
export function loadProfileQuestions(): ProfileQuestion[] {
  if (typeof window === "undefined") return DEFAULT_PROFILE_QUESTIONS;

  try {
    const stored = localStorage.getItem(PROFILE_QUESTIONS_STORAGE_KEY);
    if (!stored) return DEFAULT_PROFILE_QUESTIONS;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROFILE_QUESTIONS;
  }
}

// Save profile questions to localStorage
export function saveProfileQuestions(questions: ProfileQuestion[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PROFILE_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error("Failed to save profile questions:", e);
  }
}

// Reset profile questions to defaults
export function resetProfileQuestions(): ProfileQuestion[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_QUESTIONS_STORAGE_KEY);
  }
  return DEFAULT_PROFILE_QUESTIONS;
}
