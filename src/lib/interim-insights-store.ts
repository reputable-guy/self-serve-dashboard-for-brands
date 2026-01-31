/**
 * Interim Insights Store - REVISED
 *
 * Provides mock participant data for interim insights preview.
 * CRITICAL: Only generates data for demo/test studies, NEVER for real studies.
 *
 * Uses category config from categories.ts and assessments.ts for:
 * - Correct wearable metrics based on category's metricType
 * - Correct assessment check-in schedule based on tier
 * - Proper ordering (Tier 1 = wearables primary, Tier 2-4 = assessment primary)
 */

import { create } from "zustand";
import type {
  ParticipantInterimData,
  InterimInsightsData,
  ParticipantStatus,
  WearableMetricsData,
  AssessmentProgressData,
  ParticipantDemographics,
  VillainRating,
  CheckInQuote,
} from "./types/interim-insights";
import type { TierLevel } from "./types";
import { getCategory } from "./categories";
import { getAssessmentForCategory, getCategoryConfig } from "./assessments";

// Real study IDs that should NEVER have mock interim data
const REAL_STUDY_IDS = [
  "study-sensate-sleep",
  "study-sensate-real",
  "study-lyfefuel-energy",
  "study-lyfefuel-real",
];

// Mock participant names for demo
const MOCK_NAMES = [
  { first: "Sarah", last: "M" },
  { first: "Mike", last: "T" },
  { first: "Emily", last: "R" },
  { first: "James", last: "K" },
  { first: "Lisa", last: "W" },
  { first: "David", last: "H" },
  { first: "Anna", last: "P" },
  { first: "Chris", last: "L" },
  { first: "Rachel", last: "G" },
  { first: "Kevin", last: "S" },
  { first: "Jennifer", last: "T" },
  { first: "Brian", last: "C" },
  { first: "Amanda", last: "B" },
  { first: "Daniel", last: "F" },
  { first: "Nicole", last: "D" },
  { first: "Matthew", last: "J" },
  { first: "Stephanie", last: "V" },
  { first: "Andrew", last: "N" },
];

// Villain variable names by category (what they're tracking)
const VILLAIN_VARIABLES: Record<string, string> = {
  sleep: "sleep quality",
  recovery: "recovery time",
  fitness: "fitness performance",
  stress: "stress levels",
  energy: "energy levels",
  focus: "focus and concentration",
  mood: "mood stability",
  anxiety: "anxiety symptoms",
  pain: "pain levels",
  resilience: "mental resilience",
  skin: "skin clarity",
  gut: "digestive comfort",
  immunity: "immune resilience",
  hair: "hair health",
  weight: "appetite control",
  libido: "sexual wellness",
  satiety: "satiety after meals",
};

// Wearable metric baselines and units by metric type
const WEARABLE_BASELINES: Record<string, {
  primary: { baseline: [number, number]; unit: string };
  secondary?: { baseline: [number, number]; unit: string };
}> = {
  sleep: {
    primary: { baseline: [6.0, 7.0], unit: "hrs" }, // Total Sleep
    secondary: { baseline: [45, 65], unit: "min" }, // Deep Sleep
  },
  activity: {
    primary: { baseline: [4000, 7000], unit: "steps" }, // Daily Steps
    secondary: { baseline: [20, 35], unit: "min" }, // Active Minutes
  },
  hrv: {
    primary: { baseline: [25, 45], unit: "ms" }, // HRV
    secondary: { baseline: [6.0, 7.0], unit: "hrs" }, // Sleep Quality (as hours)
  },
  stress: {
    primary: { baseline: [25, 45], unit: "ms" }, // HRV (higher is better for stress)
    secondary: { baseline: [6.0, 7.0], unit: "hrs" }, // Total Sleep
  },
};

/**
 * Generate a random number between min and max.
 */
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max.
 */
function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate wearable metrics based on category's metricType.
 */
function generateWearableMetrics(
  category: string,
  status: ParticipantStatus
): WearableMetricsData | undefined {
  const categoryDef = getCategory(category);
  if (!categoryDef?.wearables.supported) {
    return undefined;
  }

  const metricType = categoryDef.wearables.metricType;
  if (metricType === "none") {
    return undefined;
  }

  const baselines = WEARABLE_BASELINES[metricType];
  if (!baselines) {
    return undefined;
  }

  const labels = categoryDef.wearables.displayLabels || {
    primary: "Primary Metric",
    secondary: "Secondary Metric",
  };

  // Status determines the change direction and magnitude
  let changeMultiplier: number;
  if (status === "improving") {
    changeMultiplier = randomBetween(0.15, 0.35); // +15% to +35%
  } else if (status === "stable") {
    changeMultiplier = randomBetween(-0.05, 0.08); // -5% to +8%
  } else {
    changeMultiplier = randomBetween(-0.15, -0.05); // -5% to -15%
  }

  // Primary metric
  const primaryBaseline = randomBetween(
    baselines.primary.baseline[0],
    baselines.primary.baseline[1]
  );
  const primaryCurrent = primaryBaseline * (1 + changeMultiplier);
  const primaryChangePercent = Math.round(
    ((primaryCurrent - primaryBaseline) / primaryBaseline) * 100
  );

  const primary = {
    label: labels.primary,
    baseline: Math.round(primaryBaseline * 10) / 10,
    current: Math.round(primaryCurrent * 10) / 10,
    unit: baselines.primary.unit,
    changePercent: primaryChangePercent,
    trend: (primaryChangePercent > 5 ? "up" : primaryChangePercent < -5 ? "down" : "stable") as "up" | "down" | "stable",
  };

  // Secondary metric (if available)
  let secondary: typeof primary | undefined;
  if (baselines.secondary && labels.secondary) {
    const secondaryBaseline = randomBetween(
      baselines.secondary.baseline[0],
      baselines.secondary.baseline[1]
    );
    // Secondary changes somewhat independently
    const secondaryChangeMultiplier = changeMultiplier * (0.5 + Math.random() * 0.5);
    const secondaryCurrent = secondaryBaseline * (1 + secondaryChangeMultiplier);
    const secondaryChangePercent = Math.round(
      ((secondaryCurrent - secondaryBaseline) / secondaryBaseline) * 100
    );

    secondary = {
      label: labels.secondary,
      baseline: Math.round(secondaryBaseline * 10) / 10,
      current: Math.round(secondaryCurrent * 10) / 10,
      unit: baselines.secondary.unit,
      changePercent: secondaryChangePercent,
      trend: (secondaryChangePercent > 5 ? "up" : secondaryChangePercent < -5 ? "down" : "stable") as "up" | "down" | "stable",
    };
  }

  return {
    device: "Oura Ring",
    primary,
    secondary,
  };
}

/**
 * Generate assessment progress based on category's check-in schedule.
 */
function generateAssessmentProgress(
  category: string,
  currentDay: number,
  status: ParticipantStatus,
  tier: TierLevel
): AssessmentProgressData {
  const assessment = getAssessmentForCategory(category);
  const categoryConfig = getCategoryConfig(category);

  const assessmentName = assessment?.name || `Reputable ${category.charAt(0).toUpperCase() + category.slice(1)} Assessment`;
  const checkInDays = categoryConfig?.checkInDays || [1, 30];

  // Determine which check-ins have been completed based on currentDay
  const completedDays = checkInDays.filter((day) => day <= currentDay);
  const nextCheckIn = checkInDays.find((day) => day > currentDay) || null;

  // Assessment is primary for Tier 2-4, secondary for Tier 1
  const isPrimary = tier >= 2;

  // Generate baseline score (typically 30-55 range)
  const baselineScore = randomIntBetween(30, 55);

  // Calculate current score based on status
  let scoreChange: number;
  if (status === "improving") {
    scoreChange = randomIntBetween(10, 25);
  } else if (status === "stable") {
    scoreChange = randomIntBetween(-3, 5);
  } else {
    scoreChange = randomIntBetween(-10, -3);
  }

  // Current score is baseline + change, capped at 0-100
  const currentScore = Math.max(0, Math.min(100, baselineScore + scoreChange));
  const changePercent = baselineScore > 0
    ? Math.round(((currentScore - baselineScore) / baselineScore) * 100)
    : 0;

  return {
    assessmentName,
    checkInDays,
    completedDays,
    baselineScore,
    currentScore,
    changePercent,
    nextCheckIn,
    isPrimary,
  };
}

/**
 * Generate demographics for a participant.
 */
function generateDemographics(hasWearable: boolean): ParticipantDemographics {
  const ageRanges = ["25-34", "34-44", "45-54", "55-64"];
  const genders = ["Female", "Male", "Female", "Female", "Male"]; // Slightly more female participants

  return {
    ageRange: ageRanges[randomIntBetween(0, ageRanges.length - 1)],
    gender: genders[randomIntBetween(0, genders.length - 1)],
    device: hasWearable ? "Oura Ring" : undefined,
  };
}

// Sample check-in quotes by status
const CHECK_IN_QUOTES: Record<ParticipantStatus, string[]> = {
  improving: [
    "Definitely noticing a difference this week",
    "Much better than when I started",
    "My family has noticed a change in me",
    "I'm pleasantly surprised by the results so far",
    "Starting to feel like myself again",
    "Better than I expected at this point",
  ],
  stable: [
    "Things are pretty consistent so far",
    "Not much change yet, but staying hopeful",
    "About the same as last week",
    "Steady progress, nothing dramatic",
  ],
  declining: [
    "Having a tough week",
    "Not seeing much improvement yet",
    "Hoping next week is better",
  ],
};

/**
 * Generate villain ratings (weekly self-reported progress).
 */
function generateVillainRatings(
  currentDay: number,
  status: ParticipantStatus
): VillainRating[] {
  const ratings: VillainRating[] = [];
  const checkInDays = [1, 7, 14, 21, 28];

  for (const day of checkInDays) {
    if (day > currentDay) break;

    // Generate rating based on status and progression
    let rating: number;
    const dayFactor = day / 28; // 0 to 1 as study progresses

    if (status === "improving") {
      // Start at 2, progress towards 4-5
      rating = Math.round(2 + dayFactor * 2.5 + Math.random() * 0.5);
    } else if (status === "stable") {
      // Hover around 3
      rating = Math.round(2.5 + Math.random());
    } else {
      // Start at 2-3, might decline
      rating = Math.round(2.5 - dayFactor * 0.5 + Math.random() * 0.5);
    }
    rating = Math.max(1, Math.min(5, rating));

    // Add note for some ratings (more likely as study progresses)
    const shouldAddNote = Math.random() < (0.2 + dayFactor * 0.4);
    const quotes = CHECK_IN_QUOTES[status];
    const note = shouldAddNote
      ? quotes[Math.floor(Math.random() * quotes.length)]
      : undefined;

    ratings.push({ day, rating, note });
  }

  return ratings;
}

/**
 * Generate check-in quotes from weekly assessments.
 */
function generateCheckInQuotes(
  currentDay: number,
  status: ParticipantStatus,
  villainVariable: string
): CheckInQuote[] {
  const quotes: CheckInQuote[] = [];
  const checkInDays = [7, 14, 21, 28];

  for (const day of checkInDays) {
    if (day > currentDay) break;

    // Not every check-in has a notable quote
    if (Math.random() > 0.6) continue;

    const quoteOptions = CHECK_IN_QUOTES[status];
    quotes.push({
      day,
      quote: quoteOptions[Math.floor(Math.random() * quoteOptions.length)],
      context: `Weekly check-in on ${villainVariable}`,
    });
  }

  return quotes;
}

/**
 * Calculate start date and expected completion date based on cohort.
 */
function calculateDates(cohortNumber: number): { startDate: string; expectedCompletionDate: string } {
  const today = new Date();

  // Earlier cohorts started earlier
  // Cohort 1: 21 days ago, Cohort 2: 14 days ago, Cohort 3: 7 days ago
  const daysAgo = (3 - cohortNumber + 1) * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysAgo);

  // Expected completion is 28 days from start
  const completionDate = new Date(startDate);
  completionDate.setDate(startDate.getDate() + 28);

  return {
    startDate: startDate.toISOString().split("T")[0],
    expectedCompletionDate: completionDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };
}

/**
 * Generate a single mock participant with category-specific data.
 */
function generateMockParticipant(
  index: number,
  status: ParticipantStatus,
  category: string,
  currentDay: number,
  cohortNumber: number
): ParticipantInterimData {
  const nameData = MOCK_NAMES[index % MOCK_NAMES.length];
  const displayName = `${nameData.first} ${nameData.last}.`;
  const initials = `${nameData.first[0]}${nameData.last}`;

  // Get category config for tier and wearable support
  const categoryDef = getCategory(category);
  const tier = (categoryDef?.tier || 3) as TierLevel;
  const supportsWearables = categoryDef?.wearables.supported || false;

  // Calculate dates based on cohort
  const { startDate, expectedCompletionDate } = calculateDates(cohortNumber);

  // Participant's current day based on their cohort start date
  // Earlier cohorts are further along
  const cohortDayOffset = (3 - cohortNumber) * 7;
  const participantDay = Math.max(1, Math.min(28, currentDay - cohortDayOffset + randomIntBetween(-2, 2)));

  // Generate category-specific data
  const wearableMetrics = generateWearableMetrics(category, status);
  const assessmentProgress = generateAssessmentProgress(category, participantDay, status, tier);
  const demographics = generateDemographics(supportsWearables);

  // Get villain variable for this category
  const villainVariable = VILLAIN_VARIABLES[category] || "their tracked metric";

  // Generate villain ratings and check-in quotes for expanded view
  const villainRatings = generateVillainRatings(participantDay, status);
  const checkInQuotes = generateCheckInQuotes(participantDay, status, villainVariable);

  return {
    participantId: `p-${index + 1}`,
    displayName,
    initials,
    currentDay: participantDay,
    totalDays: 28,
    status,
    tier,
    demographics,
    villainVariable,
    // Cohort and timeline info
    cohortNumber,
    cohortId: `cohort-${cohortNumber}`,
    startDate,
    expectedCompletionDate,
    // Metrics
    wearableMetrics,
    assessmentProgress,
    // Expanded view data
    villainRatings,
    checkInQuotes,
  };
}

/**
 * Generate interim insights data for a study.
 * CRITICAL: Returns null for real studies.
 */
function generateInterimInsights(
  studyId: string,
  category: string,
  currentDay: number,
  totalParticipants: number
): InterimInsightsData | null {
  // NEVER generate data for real studies
  if (REAL_STUDY_IDS.includes(studyId)) {
    return null;
  }

  // Don't show if before Day 7
  if (currentDay < 7) {
    return null;
  }

  // Calculate how many participants have enough data
  const participantsWithData = Math.min(
    totalParticipants,
    Math.floor(totalParticipants * (currentDay / 28))
  );

  // Need at least 5 participants for insights
  if (participantsWithData < 5) {
    return null;
  }

  // Distribution of statuses (realistic: most improving, some stable, few declining)
  const improvingCount = Math.round(participantsWithData * 0.65);
  const stableCount = Math.round(participantsWithData * 0.25);
  const decliningCount = participantsWithData - improvingCount - stableCount;

  const participants: ParticipantInterimData[] = [];
  let participantIndex = 0;

  // Assign cohorts: distribute participants across 3 cohorts
  // Cohort 1: Started earliest (day 21+), Cohort 2: mid (day 14+), Cohort 3: latest (day 7+)
  const getCohort = (idx: number): number => {
    const cohortSize = Math.ceil(participantsWithData / 3);
    if (idx < cohortSize) return 1;
    if (idx < cohortSize * 2) return 2;
    return 3;
  };

  // Generate improving participants
  for (let i = 0; i < improvingCount; i++) {
    const cohort = getCohort(participantIndex);
    participants.push(
      generateMockParticipant(participantIndex++, "improving", category, currentDay, cohort)
    );
  }

  // Generate stable participants
  for (let i = 0; i < stableCount; i++) {
    const cohort = getCohort(participantIndex);
    participants.push(
      generateMockParticipant(participantIndex++, "stable", category, currentDay, cohort)
    );
  }

  // Generate declining participants
  for (let i = 0; i < decliningCount; i++) {
    const cohort = getCohort(participantIndex);
    participants.push(
      generateMockParticipant(participantIndex++, "declining", category, currentDay, cohort)
    );
  }

  // Calculate completion date (28 days from now simulation)
  const daysRemaining = 28 - currentDay;
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysRemaining);

  return {
    studyId,
    currentDay,
    participantsWithData,
    minimumForInsights: 5,
    participants,
    statusCounts: {
      improving: improvingCount,
      stable: stableCount,
      declining: decliningCount,
    },
    completionDate: completionDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    daysRemaining,
  };
}

// ============================================
// STORE
// ============================================

interface InterimInsightsStore {
  // Cache of generated insights by study ID
  insightsCache: Record<string, InterimInsightsData | null>;

  // Get interim insights for a study (generates if not cached)
  getInsights: (
    studyId: string,
    category: string,
    currentDay: number,
    totalParticipants: number
  ) => InterimInsightsData | null;

  // Clear cache (useful for testing)
  clearCache: () => void;
}

export const useInterimInsightsStore = create<InterimInsightsStore>()(
  (set, get) => ({
    insightsCache: {},

    getInsights: (studyId, category, currentDay, totalParticipants) => {
      const { insightsCache } = get();

      // Check if already cached
      const cacheKey = `${studyId}-${currentDay}-${category}`;
      if (cacheKey in insightsCache) {
        return insightsCache[cacheKey];
      }

      // Generate new insights
      const insights = generateInterimInsights(
        studyId,
        category,
        currentDay,
        totalParticipants
      );

      // Cache the result
      set((state) => ({
        insightsCache: {
          ...state.insightsCache,
          [cacheKey]: insights,
        },
      }));

      return insights;
    },

    clearCache: () => {
      set({ insightsCache: {} });
    },
  })
);
