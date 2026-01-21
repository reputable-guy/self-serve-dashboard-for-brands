/**
 * Interim Insights Types - REVISED
 *
 * Types for displaying early participant insights during active studies.
 * Shows individual participant journeys (N of 1 trials), not aggregated statistics.
 *
 * What IS available:
 * 1. Wearable metrics (passive, continuous from devices)
 * 2. Assessment scores (scheduled check-ins based on tier)
 * 3. Demographics (collected at enrollment)
 * 4. Villain variable name (study configuration)
 * 5. Weekly villain ratings (self-reported progress on what they're tracking)
 * 6. Check-in responses (quotes from weekly check-ins)
 * 7. Cohort info (which cohort the participant belongs to)
 */

import type { TierLevel } from "./index";

/**
 * Participant status based on their metrics.
 */
export type ParticipantStatus = "improving" | "stable" | "declining";

/**
 * Villain rating - self-reported progress on what they're tracking.
 * Rating scale: 1-5 where higher is better.
 */
export interface VillainRating {
  day: number; // e.g., 1, 7, 14, 21, 28
  rating: number; // 1-5 scale
  note?: string; // Optional participant note/quote
}

/**
 * Check-in response - quotes from weekly check-ins.
 */
export interface CheckInQuote {
  day: number;
  quote: string;
  context?: string; // Optional context about the quote
}

/**
 * A wearable metric tracked for a participant (category-specific).
 */
export interface WearableMetricData {
  label: string; // e.g., "Total Sleep", "Daily Steps", "HRV"
  baseline: number;
  current: number;
  unit: string; // e.g., "hrs", "steps", "ms"
  changePercent: number;
  trend: "up" | "down" | "stable";
}

/**
 * Assessment progress based on scheduled check-ins.
 */
export interface AssessmentProgressData {
  /** Assessment name, e.g., "Reputable Energy Assessment" */
  assessmentName: string;
  /** Check-in days for this assessment, e.g., [1, 7, 14, 21, 28] */
  checkInDays: number[];
  /** Completed check-in days so far */
  completedDays: number[];
  /** Baseline composite score (0-100) */
  baselineScore: number;
  /** Current composite score (0-100) */
  currentScore: number;
  /** Percent change from baseline */
  changePercent: number;
  /** Next scheduled check-in day, null if all completed */
  nextCheckIn: number | null;
  /** Whether assessment is the primary measure for this tier */
  isPrimary: boolean;
}

/**
 * Demographics info (collected at enrollment).
 */
export interface ParticipantDemographics {
  ageRange: string; // e.g., "34-44"
  gender: string; // e.g., "Female"
  device?: string; // e.g., "Oura Ring"
}

/**
 * Category-specific wearable metrics configuration.
 */
export interface WearableMetricsData {
  /** Device name, e.g., "Oura Ring" */
  device: string;
  /** Primary metric (always present if wearables supported) */
  primary: WearableMetricData;
  /** Secondary metric (optional, depends on category) */
  secondary?: WearableMetricData;
}

/**
 * Individual participant's interim data.
 * Each participant is a mini case study (N of 1 trial).
 */
export interface ParticipantInterimData {
  participantId: string;
  displayName: string; // "Sarah M."
  initials: string; // "SM"
  currentDay: number; // Day 14 of their journey
  totalDays: number; // 28 (study duration)
  status: ParticipantStatus;

  /** Study tier (determines ordering of metrics vs assessment) */
  tier: TierLevel;

  /** Demographics (from enrollment) */
  demographics: ParticipantDemographics;

  /** What they're tracking (study config) - e.g., "energy levels" */
  villainVariable: string;

  // ==========================================
  // COHORT & TIMELINE INFO
  // ==========================================

  /** Cohort number (e.g., 1, 2, 3) */
  cohortNumber?: number;

  /** Cohort ID for linking */
  cohortId?: string;

  /** When this participant started the study */
  startDate: string;

  /** Expected completion date for this participant */
  expectedCompletionDate: string;

  // ==========================================
  // METRICS
  // ==========================================

  /**
   * Wearable metrics (if category supports wearables).
   * Only present for Tier 1-3 studies with wearable support.
   */
  wearableMetrics?: WearableMetricsData;

  /**
   * Assessment progress (based on tier check-in schedule).
   * Shows composite score progress at scheduled check-ins.
   */
  assessmentProgress: AssessmentProgressData;

  // ==========================================
  // EXPANDED VIEW DATA (for drill-down)
  // ==========================================

  /**
   * Weekly villain ratings - self-reported progress.
   * Shows day-by-day ratings on 1-5 scale.
   */
  villainRatings?: VillainRating[];

  /**
   * Check-in quotes - notable responses from weekly check-ins.
   */
  checkInQuotes?: CheckInQuote[];
}

/**
 * Interim insights for a study.
 * Contains all participants with their individual journeys.
 */
export interface InterimInsightsData {
  studyId: string;
  currentDay: number;
  participantsWithData: number;
  minimumForInsights: number; // 5

  /** All participants with interim data */
  participants: ParticipantInterimData[];

  /** Quick stats for filter tabs */
  statusCounts: {
    improving: number;
    stable: number;
    declining: number;
  };

  /** When final results available */
  completionDate: string;
  daysRemaining: number;
}

/**
 * Check if a study should show interim insights.
 * CRITICAL: Never show for real studies (Sensate, LYFEfuel).
 */
export function shouldShowInterimInsights(study: {
  id: string;
  status: string;
  currentDay?: number;
}): boolean {
  // Never show interim for real completed studies
  if (
    study.id === "study-sensate-sleep" ||
    study.id === "study-sensate-real" ||
    study.id === "study-lyfefuel-energy" ||
    study.id === "study-lyfefuel-real"
  ) {
    return false; // These have real final results
  }

  // Only show for active studies mid-progress (Day 7-27)
  const day = study.currentDay || 0;
  return study.status === "active" && day >= 7 && day < 28;
}
