/**
 * Widget Data Utilities
 *
 * Extracts and transforms study data for embeddable widgets.
 * Intelligently selects the best display mode based on study metrics.
 */

import { SENSATE_REAL_STORIES } from "./sensate-real-data";
import { LYFEFUEL_REAL_STORIES } from "./lyfefuel-real-data";
import {
  SENSATE_METRICS,
  LYFEFUEL_METRICS,
} from "@/components/admin/study-detail/mock-data";
import type { ParticipantStory } from "./types";

// ============================================
// TYPES
// ============================================

export interface ParticipantPreview {
  id: string;
  name: string;
  initials: string;
  rating: number;
  primaryMetric: {
    label: string;
    value: string;
  };
  quote: string;
  device: string;
  verificationId: string;
}

export interface WidgetStudyData {
  studyId: string;
  studyTitle: string;
  participantCount: number;
  durationDays: number;
  wearableType: string;
  compensationNote: string;
  participants: ParticipantPreview[];
}

export type WidgetDisplayMode = "aggregate" | "nps" | "individual";

export interface WidgetModeConfig {
  mode: WidgetDisplayMode;
  headline: string;
  subheadline: string;
  /** Consumer-friendly description of the key result */
  friendlyDescription: string;
  /** Clean headline for the floating badge widget */
  badgeHeadline: string;
  /** For aggregate mode */
  metricLabel?: string;
  metricValue?: string;
  /** For NPS mode */
  npsValue?: number;
  wouldRecommendPercent?: number;
  /** For individual mode */
  featuredParticipant?: ParticipantPreview;
}

export interface StudyMetrics {
  avgNps: number;
  wouldRecommendPercent: number;
  bestAggregateChange: number;
  bestAggregateLabel: string;
  participantCount: number;
  topPerformer: ParticipantPreview | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert metric labels to consumer-friendly descriptions
 */
function getFriendlyMetricDescription(metricLabel: string, changePercent: number): string {
  const value = Math.round(changePercent);

  switch (metricLabel) {
    case "Activity Minutes":
      return `${value}% more daily activity`;
    case "Steps":
      return `${value}% more daily steps`;
    case "HRV":
      return `${value}% improvement in heart rate variability`;
    case "Deep Sleep":
      return `${value}% more deep sleep`;
    case "Sleep":
      return `${value}% better sleep quality`;
    default:
      return `${value}% improvement in ${metricLabel.toLowerCase()}`;
  }
}

function transformParticipantToPreview(
  story: ParticipantStory,
  studyType: "sensate" | "lyfefuel"
): ParticipantPreview {
  // Determine primary metric based on study type
  let primaryMetric: { label: string; value: string };

  if (studyType === "lyfefuel") {
    // LYFEfuel: Activity minutes is primary
    const activityChange = story.wearableMetrics?.activeMinutesChange?.changePercent;
    primaryMetric = {
      label: "Activity",
      value: activityChange !== undefined ? `${activityChange > 0 ? "+" : ""}${activityChange}%` : "N/A",
    };
  } else {
    // Sensate: HRV or Deep Sleep
    const hrvChange = story.wearableMetrics?.hrvChange?.changePercent;
    const deepSleepChange = story.wearableMetrics?.deepSleepChange?.changePercent;

    // Pick the better one (positive is better)
    if (hrvChange !== undefined && hrvChange > 0) {
      primaryMetric = { label: "HRV", value: `+${hrvChange}%` };
    } else if (deepSleepChange !== undefined && deepSleepChange > 0) {
      primaryMetric = { label: "Deep Sleep", value: `+${deepSleepChange}%` };
    } else if (hrvChange !== undefined) {
      primaryMetric = { label: "HRV", value: `${hrvChange > 0 ? "+" : ""}${hrvChange}%` };
    } else {
      primaryMetric = { label: "Deep Sleep", value: deepSleepChange !== undefined ? `${deepSleepChange > 0 ? "+" : ""}${deepSleepChange}%` : "N/A" };
    }
  }

  return {
    id: story.id,
    name: story.name,
    initials: story.initials,
    rating: story.finalTestimonial?.overallRating || 4,
    primaryMetric,
    quote: story.finalTestimonial?.quote || "This product made a real difference.",
    device: story.wearableMetrics?.device || "Oura Ring",
    verificationId: story.verificationId || story.id,
  };
}

function findTopPerformer(
  stories: ParticipantStory[],
  studyType: "sensate" | "lyfefuel"
): ParticipantPreview | null {
  if (stories.length === 0) return null;

  // Find the participant with the best metrics + high satisfaction
  const scoredStories = stories.map((story) => {
    let score = 0;

    // NPS contributes to score
    const nps = story.finalTestimonial?.npsScore || 0;
    score += nps * 10;

    // Metric improvement contributes
    if (studyType === "lyfefuel") {
      const activityChange = story.wearableMetrics?.activeMinutesChange?.changePercent || 0;
      const stepsChange = story.wearableMetrics?.stepsChange?.changePercent || 0;
      score += Math.max(activityChange, stepsChange);
    } else {
      const hrvChange = story.wearableMetrics?.hrvChange?.changePercent || 0;
      const deepSleepChange = story.wearableMetrics?.deepSleepChange?.changePercent || 0;
      score += Math.max(hrvChange, deepSleepChange);
    }

    return { story, score };
  });

  scoredStories.sort((a, b) => b.score - a.score);
  return transformParticipantToPreview(scoredStories[0].story, studyType);
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Get metrics summary for a study
 */
export function getStudyMetrics(studyId: string): StudyMetrics | null {
  if (studyId === "study-sensate-real") {
    const topPerformer = findTopPerformer(SENSATE_REAL_STORIES, "sensate");

    // For Sensate, HRV and deep sleep are often weak/negative on average
    // Best aggregate is the one that's highest
    const hrvChange = SENSATE_METRICS.avgHrvChange;
    const deepSleepChange = SENSATE_METRICS.avgDeepSleepChange;
    const bestChange = Math.max(hrvChange, deepSleepChange);
    const bestLabel = hrvChange >= deepSleepChange ? "HRV" : "Deep Sleep";

    return {
      avgNps: SENSATE_METRICS.avgNps,
      wouldRecommendPercent: SENSATE_METRICS.wouldRecommendPercent,
      bestAggregateChange: bestChange,
      bestAggregateLabel: bestLabel,
      participantCount: SENSATE_REAL_STORIES.length,
      topPerformer,
    };
  }

  if (studyId === "study-lyfefuel-real") {
    const topPerformer = findTopPerformer(LYFEFUEL_REAL_STORIES, "lyfefuel");

    // LYFEfuel has strong activity metrics
    const activityChange = LYFEFUEL_METRICS.avgActivityChange;
    const stepsChange = LYFEFUEL_METRICS.avgStepsChange;
    const bestChange = Math.max(activityChange, stepsChange);
    const bestLabel = activityChange >= stepsChange ? "Activity Minutes" : "Steps";

    return {
      avgNps: LYFEFUEL_METRICS.avgNps,
      wouldRecommendPercent: LYFEFUEL_METRICS.wouldRecommendPercent,
      bestAggregateChange: bestChange,
      bestAggregateLabel: bestLabel,
      participantCount: LYFEFUEL_REAL_STORIES.length,
      topPerformer,
    };
  }

  // No data available for other studies
  return null;
}

/**
 * Intelligently determine the best widget display mode for a study.
 *
 * Logic:
 * 1. If aggregate metric >= 15%, use aggregate mode (like LYFEfuel +23%)
 * 2. Else if NPS >= 70% would recommend, use NPS mode
 * 3. Else use individual story mode with top performer
 */
export function getBestWidgetMode(studyId: string): WidgetModeConfig | null {
  const metrics = getStudyMetrics(studyId);
  if (!metrics) return null;

  // 1. Strong aggregate? Lead with it
  if (metrics.bestAggregateChange >= 15) {
    return {
      mode: "aggregate",
      headline: `+${Math.round(metrics.bestAggregateChange)}% ${metrics.bestAggregateLabel}`,
      subheadline: `${metrics.participantCount} verified participants`,
      friendlyDescription: getFriendlyMetricDescription(metrics.bestAggregateLabel, metrics.bestAggregateChange),
      badgeHeadline: getFriendlyMetricDescription(metrics.bestAggregateLabel, metrics.bestAggregateChange),
      metricLabel: metrics.bestAggregateLabel,
      metricValue: `+${Math.round(metrics.bestAggregateChange)}%`,
    };
  }

  // 2. High NPS? Lead with satisfaction
  if (metrics.wouldRecommendPercent >= 70) {
    return {
      mode: "nps",
      headline: `${metrics.wouldRecommendPercent}% Would Recommend`,
      subheadline: `${metrics.participantCount} verified participants`,
      friendlyDescription: `${metrics.wouldRecommendPercent}% of participants would recommend`,
      badgeHeadline: `${metrics.wouldRecommendPercent}% would recommend`,
      npsValue: metrics.avgNps,
      wouldRecommendPercent: metrics.wouldRecommendPercent,
    };
  }

  // 3. Default: Individual story with top performer (fallback to participant count)
  if (metrics.topPerformer) {
    return {
      mode: "individual",
      headline: `"${metrics.topPerformer.quote.slice(0, 50)}${metrics.topPerformer.quote.length > 50 ? "..." : ""}"`,
      subheadline: `${metrics.topPerformer.name} · ${metrics.topPerformer.primaryMetric.value} ${metrics.topPerformer.primaryMetric.label}`,
      friendlyDescription: `${metrics.participantCount} verified participants`,
      badgeHeadline: `${metrics.participantCount} participants verified`,
      featuredParticipant: metrics.topPerformer,
    };
  }

  return null;
}

/**
 * Get all widget display mode options for a study (for configuration UI)
 */
export function getAllWidgetModes(studyId: string): WidgetModeConfig[] {
  const metrics = getStudyMetrics(studyId);
  if (!metrics) return [];

  const modes: WidgetModeConfig[] = [];

  // Aggregate mode (always available, but may be weak)
  modes.push({
    mode: "aggregate",
    headline: `+${Math.round(metrics.bestAggregateChange)}% ${metrics.bestAggregateLabel}`,
    subheadline: `${metrics.participantCount} verified participants`,
    friendlyDescription: getFriendlyMetricDescription(metrics.bestAggregateLabel, metrics.bestAggregateChange),
    badgeHeadline: getFriendlyMetricDescription(metrics.bestAggregateLabel, metrics.bestAggregateChange),
    metricLabel: metrics.bestAggregateLabel,
    metricValue: `+${Math.round(metrics.bestAggregateChange)}%`,
  });

  // NPS mode
  modes.push({
    mode: "nps",
    headline: `${metrics.wouldRecommendPercent}% Would Recommend`,
    subheadline: `${metrics.participantCount} verified participants`,
    friendlyDescription: `${metrics.wouldRecommendPercent}% of participants would recommend`,
    badgeHeadline: `${metrics.wouldRecommendPercent}% would recommend`,
    npsValue: metrics.avgNps,
    wouldRecommendPercent: metrics.wouldRecommendPercent,
  });

  // Simple mode (participant count - safe fallback)
  modes.push({
    mode: "individual",
    headline: `${metrics.participantCount} verified participants`,
    subheadline: "Verified by Reputable",
    friendlyDescription: `${metrics.participantCount} verified participants`,
    badgeHeadline: `${metrics.participantCount} participants verified`,
    featuredParticipant: metrics.topPerformer || undefined,
  });

  return modes;
}

/**
 * Get full widget data for a study (for modal and product page demo)
 */
export function getWidgetDataForStudy(studyId: string): WidgetStudyData | null {
  if (studyId === "study-sensate-real") {
    const participants = SENSATE_REAL_STORIES.slice(0, 6).map((story) =>
      transformParticipantToPreview(story, "sensate")
    );

    return {
      studyId,
      studyTitle: "Sensate Sleep & Stress Study",
      participantCount: SENSATE_REAL_STORIES.length,
      durationDays: 28,
      wearableType: "Oura Ring",
      compensationNote:
        "Yes, participants received a rebate for completing the study. Compensation was the same regardless of their feedback or results.",
      participants,
    };
  }

  if (studyId === "study-lyfefuel-real") {
    const participants = LYFEFUEL_REAL_STORIES.slice(0, 6).map((story) =>
      transformParticipantToPreview(story, "lyfefuel")
    );

    return {
      studyId,
      studyTitle: "LYFEfuel Daily Essentials Study",
      participantCount: LYFEFUEL_REAL_STORIES.length,
      durationDays: 24,
      wearableType: "Oura Ring",
      compensationNote:
        "Yes, participants received a rebate for completing the study. Compensation was the same regardless of their feedback or results.",
      participants,
    };
  }

  // No data available for other studies
  return null;
}

/**
 * Check if a study has widget data available
 */
export function hasWidgetData(studyId: string): boolean {
  return studyId === "study-sensate-real" || studyId === "study-lyfefuel-real";
}
