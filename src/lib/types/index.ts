/**
 * Centralized Type Definitions
 *
 * This is the SINGLE SOURCE OF TRUTH for all domain types in the codebase.
 * All other files should import types from here.
 *
 * Principles:
 * - One canonical definition per concept
 * - Types are colocated by domain
 * - No duplicate type definitions elsewhere
 */

// ============================================
// TIER SYSTEM
// ============================================

/** Tier levels for the measurement system (1-4) */
export type TierLevel = 1 | 2 | 3 | 4;

// ============================================
// CATEGORIES - SINGLE SOURCE OF TRUTH
// ============================================

/**
 * All valid category values in the system.
 * This is THE canonical list - do not duplicate elsewhere.
 */
export const CATEGORY_VALUES = [
  "sleep",
  "recovery",
  "fitness",
  "stress",
  "energy",
  "focus",
  "mood",
  "anxiety",
  "pain",
  "skin",
  "gut",
  "immunity",
  "hair",
  "weight",
  "libido",
  "satiety",
  "resilience",
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

/**
 * Full category definition with all metadata.
 * This replaces the scattered definitions in constants.ts, category-config.ts, etc.
 */
export interface CategoryDefinition {
  value: CategoryValue;
  label: string;
  tier: TierLevel;
  /** Assessment configuration */
  assessment: {
    metricLabel: string;
    higherIsBetter: boolean;
    defaultRange: {
      baselineRaw: number;
      endpointRaw: number;
      maxRaw: number;
    };
  };
  /** Wearable configuration (null for tier 4 categories) */
  wearables: {
    supported: boolean;
    metricType: "sleep" | "activity" | "hrv" | "stress" | "none";
    primaryField?: string;
    secondaryField?: string;
    displayLabels?: {
      primary: string;
      secondary?: string;
    };
  };
}

// ============================================
// DEVICES
// ============================================

export const DEVICE_VALUES = ["any", "oura", "whoop", "apple", "garmin", "fitbit"] as const;
export type DeviceValue = (typeof DEVICE_VALUES)[number];

export interface DeviceDefinition {
  value: DeviceValue;
  label: string;
}

// ============================================
// STUDY STATUS
// ============================================

export const STUDY_STATUS_VALUES = [
  "draft",
  "recruiting",
  "filling-fast",
  "full",
  "active",
  "completed",
  "archived",
] as const;

export type StudyStatus = (typeof STUDY_STATUS_VALUES)[number];

export interface StudyStatusDefinition {
  bg: string;
  text: string;
  label: string;
}

// ============================================
// USER & AUTH
// ============================================

export type UserRole = "admin" | "brand";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  brandId?: string; // Only for brand users
}

// ============================================
// BRAND
// ============================================

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  studyCount: number;
  activeStudyCount: number;
}

// ============================================
// STUDY
// ============================================

/** Protocol details for transparency on verification pages */
export interface StudyProtocol {
  baselineDays: number;
  interventionDays: number;
  wearableTypes: string[];
  dailyInstructions: string;
  compensationNote?: string;
}

export interface Study {
  id: string;
  name: string;
  brandId: string;
  brandName: string; // TODO: Consider removing - should lookup from brands store
  category: string;
  categoryKey: string;
  categoryLabel: string;
  status: StudyStatus;
  tier: TierLevel;
  participants: number;
  targetParticipants: number;
  startDate: string | null;
  endDate: string | null;
  rebateAmount: number;
  hasWearables: boolean;
  productDescription: string;
  productImage: string;
  hookQuestion: string;
  studyTitle: string;
  whatYoullDiscover: string[];
  dailyRoutine: string;
  howItWorks: string;
  whatYoullDoSections?: Array<{
    sectionTitle: string;
    items: Array<{ icon: string; title: string; subtitle: string }>;
  }>;
  whatYoullGet?: Array<{
    icon: string;
    item: string;
    note: string;
    value: string;
  }>;
  assessmentVersion: string;
  // Protocol details for verification page transparency
  protocol?: StudyProtocol;
  // Legacy fields
  productName?: string;
  durationDays?: number;
  requiredDevice?: string;
  villainVariable?: string;
  villainQuestionDays?: number[];
  customQuestions?: CustomQuestion[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ASSESSMENT TYPES
// ============================================

export type ResponseType =
  | "scale_5"
  | "scale_10"
  | "scale_11"
  | "frequency_5"
  | "frequency_4"
  | "open_text"
  | "photo"
  | "numeric";

export interface ResponseOption {
  value: number;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  responseType: ResponseType;
  responseOptions?: ResponseOption[];
  reverseScored?: boolean;
  isPrimary?: boolean;
  dayOnly?: number[];
}

export interface ReputableAssessment {
  id: string;
  name: string;
  shortName: string;
  description: string;
  inspiredBy: string;
  version: string;
  versionDate: string;
  questions: AssessmentQuestion[];
  checkInDays: number[];
  requiresPhotos?: boolean;
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  responseType: ResponseType;
  rawValue: number | string;
  isReverseScored: boolean;
  normalizedValue: number;
}

export interface AssessmentResponse {
  odorId?: string;
  participantId: string;
  studyId: string;
  category: string;
  day: number;
  timestamp: Date;
  responses: QuestionResponse[];
  compositeScore: number;
  primaryScore: number;
}

export interface AssessmentResult {
  assessmentId: string;
  assessmentName: string;
  categoryLabel: string;
  baseline: {
    date: Date;
    compositeScore: number;
    primaryScore: number;
    primaryRaw: number;
    primaryMax: number;
    responses: QuestionResponse[];
  };
  endpoint: {
    date: Date;
    compositeScore: number;
    primaryScore: number;
    primaryRaw: number;
    primaryMax: number;
    responses: QuestionResponse[];
  };
  change: {
    compositePoints: number;
    compositePercent: number;
    primaryPoints: number;
    primaryPercent: number;
  };
  improved: boolean;
  headline: string;
}

export interface ScoreInterpretation {
  minScore: number;
  maxScore: number;
  label: string;
  color: string;
}

// ============================================
// PARTICIPANT & MOCK DATA TYPES
// ============================================

export interface MockParticipant {
  id: number;
  name: string;
  status: "active" | "completed" | "at-risk";
  day: number;
  compliance: number;
  lastActive: string;
  initials: string;
  age: number;
  location: string;
  device: string;
  enrolledDate: string;
  email?: string;
}

export interface DailyMetricPoint {
  day: number;
  date: string;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  totalSleep: number;
  hrv: number;
  restingHr: number;
  sleepScore: number;
  recoveryScore: number;
}

export interface CheckInResponse {
  day: number;
  date: string;
  completed: boolean;
  villainResponse?: {
    question: string;
    answer: string;
  };
  customResponses?: {
    question: string;
    questionType: "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
    answer: string;
    likertValue?: number;
    likertMin?: number;
    likertMax?: number;
    likertMinLabel?: string;
    likertMaxLabel?: string;
  }[];
}

export interface ParticipantDetail {
  participantId: number;
  baselineMetrics: {
    avgDeepSleep: number;
    avgRemSleep: number;
    avgTotalSleep: number;
    avgHrv: number;
    avgRestingHr: number;
    avgSleepScore: number;
  };
  dailyMetrics: DailyMetricPoint[];
  checkIns: CheckInResponse[];
  syncHistory: { date: string; synced: boolean }[];
}

export interface MockMetric {
  label: string;
  value: string;
  positive: boolean;
}

export interface MockTestimonial {
  id: number;
  participant: string;
  initials: string;
  age: number;
  location: string;
  completedDay: number;
  overallRating: number;
  story: string;
  metrics: MockMetric[];
  benefits: string[];
  verified: boolean;
  verificationId: string;
  device: string;
  hasVideo?: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: string;
}

export interface WearableMetrics {
  device: string;
  sleepChange?: { before: number; after: number; unit: string; changePercent: number };
  deepSleepChange?: { before: number; after: number; unit: string; changePercent: number };
  hrvChange?: { before: number; after: number; unit: string; changePercent: number };
  restingHrChange?: { before: number; after: number; unit: string; changePercent: number };
  stepsChange?: { before: number; after: number; unit: string; changePercent: number };
  activeMinutesChange?: { before: number; after: number; unit: string; changePercent: number };
  activeCaloriesChange?: { before: number; after: number; unit: string; changePercent: number };
  sleepEfficiencyChange?: { before: number; after: number; unit: string; changePercent: number };
}

/** Data source type for distinguishing real vs demo/generated data */
export type DataSource = "real" | "demo" | "generated";

export interface ParticipantStory {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  tier: TierLevel;
  /** Data source - distinguishes real participant data from demo/generated */
  dataSource?: DataSource;
  profile: {
    // Core profile fields
    ageRange: string;
    lifeStage: string;
    primaryWellnessGoal?: string;
    baselineStressLevel?: number;
    // Demographics (from configurable demographic questions)
    gender?: string;
    educationLevel?: string;
    employmentStatus?: string;
    householdIncome?: string;
    maritalStatus?: string;
    ethnicity?: string;
    location?: string;
  };
  baseline: {
    motivation: string;
    hopedResults: string;
    villainDuration?: string; // Optional - not collected in all studies
    triedOther?: string; // Optional - not collected in all studies
  };
  journey: {
    startDate: string;
    endDate: string;
    durationDays: number;
    villainVariable: string;
    villainRatings: { day: number; rating: number; note?: string }[];
    keyQuotes: { day: number; quote: string; context: string }[];
  };
  wearableMetrics?: WearableMetrics;
  assessmentResults?: AssessmentResult[];
  // Optional fields - may be included in full stories
  finalTestimonial?: {
    quote: string;
    overallRating: number;
    wouldRecommend?: boolean; // Optional - can be derived from NPS score
    reportedBenefits: string[];
    // Extended fields for real study data
    npsScore?: number; // Original NPS score (0-10) before conversion to stars
    satisfaction?: string; // "Very satisfied", "Satisfied", "Neutral", etc.
    wouldContinue?: string; // "Likely", "Very likely", "Neutral", etc.
    challenges?: string; // Any challenges or negative feedback
  };
  verification?: {
    id: string;
    timestamp: string;
    dataIntegrity: "verified" | "partial" | "unverified";
    complianceRate: number;
  };
  // Extended fields used in sample stories
  testimonialResponses?: Array<{ day: number; question: string; response: string }>;
  verified?: boolean;
  verificationId?: string;
  completedAt?: string;
  overallRating?: number;
  assessmentResult?: AssessmentResult;
  photoDocumentation?: {
    beforePhoto?: string;
    afterPhoto?: string;
  };
}

// ============================================
// CUSTOM QUESTIONS (Study Form)
// ============================================

/**
 * Custom question definition for studies.
 * Matches the definition in study-context.tsx for compatibility.
 */
export interface CustomQuestion {
  questionText: string;
  questionType: "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
  options: string[];
  showOnDays: number[];
  // Likert scale specific fields
  likertMin?: number;
  likertMax?: number;
  likertMinLabel?: string;
  likertMaxLabel?: string;
}

// ============================================
// HELPER TYPES
// ============================================

/** Extract the type of array elements */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/** Make specific properties optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific properties required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
