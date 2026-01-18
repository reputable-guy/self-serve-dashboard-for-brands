/**
 * Story Utilities
 *
 * Shared utilities for story generation across all brand-specific story files.
 * This is the single source of truth for:
 * - Primary metric questions (used in headlines)
 * - Assessment result creation
 * - Brand study stats interfaces
 */

import { AssessmentResult } from "../assessments";
import { ParticipantStory } from "../mock-data";

// ============================================
// PRIMARY METRIC QUESTIONS
// ============================================

/**
 * Primary metric question texts for generating meaningful headlines.
 * Uses the primary survey question for each category instead of generic category labels.
 * Single source of truth - imported by all story files.
 */
export const PRIMARY_METRIC_QUESTIONS: Record<string, string> = {
  "reputable-energy": "Overall energy level",
  "reputable-gut": "Digestive comfort",
  "reputable-weight": "Appetite control",
  "reputable-sleep": "Sleep quality",
  "reputable-stress": "Stress level",
  "reputable-focus": "Mental clarity",
  "reputable-mood": "Overall mood",
  "reputable-anxiety": "Anxiety level",
  "reputable-pain": "Average pain",
  "reputable-skin": "Skin appearance",
  "reputable-hair": "Hair health",
  "reputable-immunity": "Immune resilience",
  "reputable-recovery": "Recovery feeling",
  "reputable-fitness": "Fitness level",
};

/**
 * Categories where lower raw scores are better.
 * For stress/anxiety/pain: a score of 3/10 is better than 7/10.
 */
export const LOWER_IS_BETTER_CATEGORIES = [
  "reputable-stress",
  "reputable-anxiety",
  "reputable-pain",
];

// ============================================
// ASSESSMENT RESULT CREATION
// ============================================

export interface CreateAssessmentResultOptions {
  assessmentId: string;
  assessmentName: string;
  categoryLabel: string;
  baselineComposite: number;
  endpointComposite: number;
  baselineRaw: number;
  endpointRaw: number;
  maxRaw?: number;
  /** Override the automatic lower-is-better detection */
  higherIsBetter?: boolean;
}

/**
 * Create an assessment result with properly calculated changes and headline.
 * Automatically detects whether higher or lower scores are better based on category,
 * or can be overridden with the higherIsBetter option.
 */
export function createAssessmentResult(
  options: CreateAssessmentResultOptions
): AssessmentResult;

/**
 * Legacy signature for backwards compatibility.
 * @deprecated Use the options object signature instead.
 */
export function createAssessmentResult(
  assessmentId: string,
  assessmentName: string,
  categoryLabel: string,
  baselineComposite: number,
  endpointComposite: number,
  baselineRaw: number,
  endpointRaw: number,
  maxRaw?: number,
  higherIsBetter?: boolean
): AssessmentResult;

export function createAssessmentResult(
  optionsOrAssessmentId: CreateAssessmentResultOptions | string,
  assessmentName?: string,
  categoryLabel?: string,
  baselineComposite?: number,
  endpointComposite?: number,
  baselineRaw?: number,
  endpointRaw?: number,
  maxRaw: number = 10,
  higherIsBetterParam?: boolean
): AssessmentResult {
  // Normalize to options object
  let options: CreateAssessmentResultOptions;

  if (typeof optionsOrAssessmentId === "string") {
    // Legacy signature
    options = {
      assessmentId: optionsOrAssessmentId,
      assessmentName: assessmentName!,
      categoryLabel: categoryLabel!,
      baselineComposite: baselineComposite!,
      endpointComposite: endpointComposite!,
      baselineRaw: baselineRaw!,
      endpointRaw: endpointRaw!,
      maxRaw,
      higherIsBetter: higherIsBetterParam,
    };
  } else {
    options = optionsOrAssessmentId;
  }

  const {
    assessmentId,
    categoryLabel: catLabel,
    baselineComposite: basComp,
    endpointComposite: endComp,
    baselineRaw: basRaw,
    endpointRaw: endRaw,
    maxRaw: max = 10,
  } = options;

  const compositeChange = endComp - basComp;
  const compositePercent = Math.round((compositeChange / basComp) * 100);

  // Determine if lower is better (auto-detect from category or use explicit override)
  const lowerIsBetter =
    options.higherIsBetter !== undefined
      ? !options.higherIsBetter
      : LOWER_IS_BETTER_CATEGORIES.includes(assessmentId);

  // Calculate the percentage change correctly based on direction
  let rawPercent: number;
  let headline: string;
  const primaryMetricLabel = PRIMARY_METRIC_QUESTIONS[assessmentId] || catLabel;

  if (lowerIsBetter) {
    // For stress/anxiety/pain: reduction is improvement
    rawPercent = Math.round(((basRaw - endRaw) / basRaw) * 100);
    headline = `${primaryMetricLabel} reduced from ${basRaw}/${max} to ${endRaw}/${max} (-${rawPercent}%)`;
  } else {
    // For most categories: higher is better
    rawPercent = Math.round(((endRaw - basRaw) / basRaw) * 100);
    headline = `${primaryMetricLabel} improved from ${basRaw}/${max} to ${endRaw}/${max} (+${rawPercent}%)`;
  }

  return {
    assessmentId,
    assessmentName: options.assessmentName,
    categoryLabel: catLabel,
    baseline: {
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      compositeScore: basComp,
      primaryScore: Math.round((basRaw / max) * 100),
      primaryRaw: basRaw,
      primaryMax: max,
      responses: [],
    },
    endpoint: {
      date: new Date(),
      compositeScore: endComp,
      primaryScore: Math.round((endRaw / max) * 100),
      primaryRaw: endRaw,
      primaryMax: max,
      responses: [],
    },
    change: {
      compositePoints: compositeChange,
      compositePercent,
      primaryPoints:
        Math.round((endRaw / max) * 100) - Math.round((basRaw / max) * 100),
      primaryPercent: rawPercent,
    },
    improved: compositeChange > 0,
    headline,
  };
}

// ============================================
// BRAND STUDY STATS
// ============================================

/**
 * Generic interface for brand study statistics.
 * Used by both LYFEfuel and Sensate demo stories.
 */
export interface BrandStudyStats {
  studyId: string;
  studyName: string;
  category: string;
  participants: number;
  completionRate: number;
  averageImprovement: number;
  topHeadline: string;
  stories: ParticipantStory[];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get stories for a specific study from a stats array.
 */
export function getStoriesForStudy(
  stats: BrandStudyStats[],
  studyId: string
): ParticipantStory[] {
  const found = stats.find((s) => s.studyId === studyId);
  return found?.stories || [];
}

/**
 * Get study stats by ID from a stats array.
 */
export function getStudyStats(
  stats: BrandStudyStats[],
  studyId: string
): BrandStudyStats | undefined {
  return stats.find((s) => s.studyId === studyId);
}
