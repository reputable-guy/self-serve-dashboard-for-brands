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
  /** Default villain variable (what participants track) - e.g., "energy levels" */
  villainVariable: string;
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
  "coming_soon",
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

/** Launch checklist tracks progress toward going live */
export interface LaunchChecklist {
  /** Always true after study creation */
  settingsComplete: boolean;
  /** User clicked "I've reviewed" in preview */
  previewReviewed: boolean;
  /** User confirmed inventory is ready */
  inventoryConfirmed: boolean;
  /** ISO timestamp when study went live (null if not yet live) */
  goLiveAt?: string;
}

// ============================================
// ENROLLMENT (Brand-Recruits Model)
// ============================================

/** Enrollment status for brand-recruited studies */
export type EnrollmentStatus = 'draft' | 'open' | 'paused' | 'closed';

/** Enrollment configuration for brand-recruited studies */
export interface EnrollmentConfig {
  /** Maximum number of participants that can enroll */
  enrollmentCap: number;
  /** Optional deadline after which enrollment closes (ISO date) */
  enrollmentDeadline?: string;
  /** URL-friendly slug for enrollment link (e.g., "sensate-stress-2025") */
  enrollmentSlug: string;
  /** Current enrollment status */
  enrollmentStatus: EnrollmentStatus;
  /** Number of participants currently enrolled */
  enrolledCount?: number;
}

// ============================================
// EARLY INSIGHTS (Brand-Recruited Studies)
// ============================================

/** Participant archetype for simulation and analysis */
export type ParticipantArchetype = 'skeptic' | 'desperate' | 'power_user' | 'struggler' | 'optimist';

/** Hero symptom data - the single biggest challenge */
export interface HeroSymptom {
  /** The question asked (e.g., "What's your biggest challenge with sleep?") */
  question: string;
  /** Verbatim response (e.g., "I haven't slept through the night in 3 years") */
  response: string;
  /** Severity rating 1-10 */
  severity: number;
}

/** Pain story - their journey context */
export interface PainStory {
  /** How long they've been dealing with the issue */
  duration: string;
  /** What they've tried before that didn't work */
  failedAlternatives: string[];
  /** How desperate they are 1-10 */
  desperationLevel: number;
  /** How committed they are to solving this 1-10 */
  commitmentLevel: number;
  /** Notable verbatim quote about their struggle */
  verbatimQuote?: string;
}

/** Specific hoped outcomes */
export interface HopedOutcomes {
  /** Primary goal (e.g., "Fall asleep within 15 minutes") */
  primaryGoal: string;
  /** Secondary goals */
  secondaryGoals: string[];
  /** Expected timeframe (e.g., "Within 2 weeks") */
  timeframe: string;
}

/** Status rating for wearable baseline metrics */
export type WearableMetricStatus = 'poor' | 'below_avg' | 'normal' | 'good' | 'excellent';

/** Individual wearable baseline metric (7-day average before product use) */
export interface WearableBaselineMetric {
  /** Metric label (e.g., "Sleep Score", "HRV", "Total Sleep") */
  label: string;
  /** Metric value (number or formatted string like "5h 42m") */
  value: string | number;
  /** Unit (e.g., "/100", "bpm", "ms") */
  unit?: string;
  /** Status rating based on population norms */
  status: WearableMetricStatus;
  /** Icon name for display (e.g., "moon", "heart", "activity") */
  iconName?: 'moon' | 'heart' | 'activity' | 'clock' | 'zap' | 'gauge';
}

/** Wearable baseline data (7-day average before product use) */
export interface WearableBaselineData {
  /** Category this data is for */
  category: 'sleep' | 'stress' | 'recovery' | 'fitness';
  /** Averaging period description */
  avgPeriod: string;
  /** Individual metrics */
  metrics: WearableBaselineMetric[];
}

/** Baseline data collected during the first week of study enrollment */
export interface BaselineData {
  /** Responses to baseline questions (motivation, hoped results, etc.) */
  baselineResponses?: {
    questionId: string;
    response: string;
  }[];
  /** Profile data collected progressively days 1-5 */
  profileData?: {
    ageRange?: string;
    lifeStage?: string;
    primaryWellnessGoal?: string;
    baselineStressLevel?: number;
    /** Semi-anonymized location (e.g., "Texas") */
    location?: string;
  };
  /** Day 1 assessment scores */
  assessmentData?: {
    compositeScore: number;
    primaryScore: number;
    primaryRaw: number;
  };
  /** When baseline collection was completed */
  completedAt?: string;

  // === NEW: Enhanced baseline data for voyeuristic insights ===

  /** Hero symptom - the single biggest challenge */
  heroSymptom?: HeroSymptom;
  /** Pain story - their journey context */
  painStory?: PainStory;
  /** Specific hoped outcomes */
  hopedOutcomes?: HopedOutcomes;
  /** Participant archetype (for simulation and visual styling) */
  archetype?: ParticipantArchetype;
  /** Wearable baseline data (7-day average before product use) - Tier 1-2 only */
  wearableBaseline?: WearableBaselineData;
}

/** Individual participant card data for early insights (n=1+) */
export interface ParticipantInsightCard {
  id: string;
  /** Semi-anonymized name (e.g., "Sarah M.") */
  displayName: string;
  initials: string;
  /** Avatar color generated from name for consistency */
  avatarColor: string;
  /** When they enrolled */
  enrolledAt: string;
  /** Relative time (e.g., "just now", "12 min ago") */
  enrolledAgo: string;

  // Their story
  heroSymptom: string;
  heroSymptomSeverity?: number;
  painDuration?: string;
  failedAlternatives: string[];
  desperationLevel?: number;

  // Their hopes
  primaryGoal: string;
  verbatimQuote?: string;

  // Profile context (semi-anonymized)
  ageRange: string;
  location?: string;

  // Assessment baseline
  baselineScore?: number;

  // Archetype for visual styling
  archetype?: ParticipantArchetype;

  // Wearable baseline data (Tier 1-2 categories only)
  wearableBaseline?: WearableBaselineData;
}

/** Timeline event for live activity feed */
export interface InsightTimelineEvent {
  id: string;
  type: 'new_participant' | 'quote_captured' | 'milestone' | 'pattern_emerging';
  timestamp: string;
  /** Relative time display */
  timeAgo: string;
  /** Participant initials (if applicable) */
  participantInitials?: string;
  /** Event content/description */
  content: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** Emerging patterns when n >= 3 */
export interface EmergingPatterns {
  /** Top pain points mentioned */
  topPainPoints: { label: string; count: number; percentage: number }[];
  /** Common failed alternatives */
  commonFailedAlternatives: { label: string; count: number }[];
  /** Average desperation level */
  averageDesperationLevel: number;
  /** Most common pain duration */
  mostCommonDuration: string;
  /** Pattern confidence note */
  confidenceNote: string;
}

/** Aggregated responses for a single baseline question */
export interface BaselineQuestionAggregation {
  questionId: string;
  questionText: string;
  questionType: "text" | "voice_and_text" | "multiple_choice";
  /** Response distribution */
  responses: {
    value: string;
    count: number;
    percentage: number;
  }[];
  /** Notable quotes from text responses (for display) */
  notableQuotes?: {
    quote: string;
    participantInitials: string;
  }[];
  totalResponses: number;
}

/** Demographics breakdown for early insights */
export interface EarlyInsightsDemographics {
  ageRanges: { range: string; count: number; percentage: number }[];
  lifeStages: { stage: string; count: number; percentage: number }[];
  primaryGoals?: { goal: string; count: number; percentage: number }[];
  baselineStressDistribution?: { level: number; count: number; percentage: number }[];
}

/** Baseline assessment score distribution */
export interface BaselineScoreDistribution {
  assessmentName: string;
  categoryLabel: string;
  averageScore: number;
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  primaryQuestionSummary?: {
    questionText: string;
    averageRaw: number;
    maxValue: number;
  };
}

/** Complete early insights data for a brand-recruited study */
export interface EarlyInsightsData {
  studyId: string;
  /** Total participants in study */
  totalParticipants: number;
  /** Participants who have completed baseline */
  participantsWithBaseline: number;
  /** Minimum required for aggregate insights (10) - but individual cards show from n=1 */
  minimumRequired: number;
  /** When insights were last computed */
  updatedAt: string;
  /** Aggregated baseline question responses */
  baselineQuestions: BaselineQuestionAggregation[];
  /** Demographics breakdown */
  demographics: EarlyInsightsDemographics;
  /** Day 1 assessment score distribution */
  baselineScores?: BaselineScoreDistribution;

  // === NEW: Progressive disclosure data ===

  /** Individual participant cards (always shown when n >= 1) */
  participantCards: ParticipantInsightCard[];
  /** Live activity timeline events */
  timeline: InsightTimelineEvent[];
  /** Emerging patterns (shown when n >= 3) */
  emergingPatterns?: EmergingPatterns;
  /** Notable quotes for carousel */
  notableQuotes: {
    quote: string;
    initials: string;
    context: string;
    archetype?: ParticipantArchetype;
  }[];
}

export interface Study {
  id: string;
  // Demo studies show sample/mock data; real studies show actual data (or empty state if new)
  isDemo?: boolean;
  name: string;
  brandId: string;
  // NOTE: brandName removed - lookup from brands store at render time using getBrandById(study.brandId)?.name
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
  // Shipping configuration
  fulfillmentModel?: "recruited" | "rebate";
  shippingProductDescription?: string;
  // Launch checklist state
  launchChecklist?: LaunchChecklist;
  // Primary metric configuration (Tier 1 wearables studies only)
  primaryMetricConfig?: {
    mode: "auto" | "manual";
    selectedMetric?: string; // e.g., "deep_sleep_duration"
  };
  // Enrollment configuration (for brand-recruited studies only)
  enrollmentConfig?: EnrollmentConfig;
  // Pre-computed aggregate metrics (ground truth for real data studies)
  avgImprovement?: number;
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
  /** Cohort number (e.g., 1, 2, 3) - for studies with multiple cohorts */
  cohortNumber?: number;
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
  /** Generated narrative (LLM output) */
  generatedNarrative?: string;
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

// ============================================
// SHIPPING & FULFILLMENT
// ============================================

export * from "./shipping";

// ============================================
// COMPLIANCE & PARTICIPANT MONITORING
// ============================================

export * from "./compliance";

// ============================================
// ADMIN ALERTS
// ============================================

export * from "./alerts";

// ============================================
// INTERIM INSIGHTS
// ============================================

export * from "./interim-insights";
