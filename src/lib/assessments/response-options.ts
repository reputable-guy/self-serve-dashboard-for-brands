/**
 * Response Options Presets
 *
 * Reusable response option sets for assessment questions.
 * These presets provide consistent scales across all assessments.
 */

import type { ResponseOption } from "../types";

// ============================================
// QUALITY & GENERAL RATING SCALES
// ============================================

export const QUALITY_5: ResponseOption[] = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very good" },
];

export const QUALITY_5_EXCELLENT: ResponseOption[] = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent" },
];

// ============================================
// STATE & FEELING SCALES
// ============================================

export const RESTED_5: ResponseOption[] = [
  { value: 1, label: "Not at all rested" },
  { value: 2, label: "Slightly rested" },
  { value: 3, label: "Moderately rested" },
  { value: 4, label: "Well rested" },
  { value: 5, label: "Completely rested" },
];

export const RECOVERED_5: ResponseOption[] = [
  { value: 1, label: "Not at all recovered" },
  { value: 2, label: "Slightly recovered" },
  { value: 3, label: "Moderately recovered" },
  { value: 4, label: "Well recovered" },
  { value: 5, label: "Fully recovered" },
];

export const READY_5: ResponseOption[] = [
  { value: 1, label: "Not at all ready" },
  { value: 2, label: "Slightly ready" },
  { value: 3, label: "Moderately ready" },
  { value: 4, label: "Very ready" },
  { value: 5, label: "Completely ready" },
];

export const MOTIVATED_5: ResponseOption[] = [
  { value: 1, label: "Not at all motivated" },
  { value: 2, label: "Slightly motivated" },
  { value: 3, label: "Moderately motivated" },
  { value: 4, label: "Very motivated" },
  { value: 5, label: "Extremely motivated" },
];

// ============================================
// FREQUENCY SCALES
// ============================================

export const FREQUENCY_5_NEVER_TO_OFTEN: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly often" },
  { value: 4, label: "Very often" },
];

export const FREQUENCY_5_RARELY: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Always" },
];

export const FREQUENCY_5_DAYS: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely (1-2 days)" },
  { value: 2, label: "Sometimes (3-4 days)" },
  { value: 3, label: "Often (5-6 days)" },
  { value: 4, label: "Every day" },
];

export const FREQUENCY_4_GAD: ResponseOption[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

// ============================================
// AFFECT & IMPACT SCALES
// ============================================

export const AFFECT_5: ResponseOption[] = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "A little" },
  { value: 3, label: "Moderately" },
  { value: 4, label: "Quite a bit" },
  { value: 5, label: "Extremely" },
];

export const BOTHERED_5: ResponseOption[] = [
  { value: 5, label: "Not at all bothered" },
  { value: 4, label: "Slightly bothered" },
  { value: 3, label: "Moderately bothered" },
  { value: 2, label: "Very bothered" },
  { value: 1, label: "Extremely bothered" },
];

// ============================================
// SLEEP-SPECIFIC SCALES
// ============================================

export const SLEEP_LATENCY_4: ResponseOption[] = [
  { value: 4, label: "Less than 15 minutes" },
  { value: 3, label: "15-30 minutes" },
  { value: 2, label: "31-60 minutes" },
  { value: 1, label: "More than 60 minutes" },
];

export const WAKE_UPS_4: ResponseOption[] = [
  { value: 4, label: "Never" },
  { value: 3, label: "Once per night" },
  { value: 2, label: "2-3 times per night" },
  { value: 1, label: "4 or more times per night" },
];

// ============================================
// FITNESS & ACTIVITY SCALES
// ============================================

export const SORENESS_5: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely (1-2 days)" },
  { value: 2, label: "Sometimes (3-4 days)" },
  { value: 3, label: "Often (5-6 days)" },
  { value: 4, label: "Every day" },
];

export const ACTIVITY_DAYS_5: ResponseOption[] = [
  { value: 1, label: "0 days" },
  { value: 2, label: "1-2 days" },
  { value: 3, label: "3-4 days" },
  { value: 4, label: "5-6 days" },
  { value: 5, label: "Every day" },
];

// ============================================
// ENERGY & BALANCE SCALES
// ============================================

export const ENERGY_CONSISTENCY_5: ResponseOption[] = [
  { value: 1, label: "Very inconsistent (major highs and lows)" },
  { value: 2, label: "Somewhat inconsistent" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Fairly consistent" },
  { value: 5, label: "Very consistent (steady energy all day)" },
];

export const BALANCE_5: ResponseOption[] = [
  { value: 1, label: "Very unbalanced" },
  { value: 2, label: "Somewhat unbalanced" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat balanced" },
  { value: 5, label: "Very balanced" },
];

// ============================================
// CONFIDENCE & SATISFACTION SCALES
// ============================================

export const CONFIDENT_5: ResponseOption[] = [
  { value: 1, label: "Not at all confident" },
  { value: 2, label: "Slightly confident" },
  { value: 3, label: "Moderately confident" },
  { value: 4, label: "Very confident" },
  { value: 5, label: "Extremely confident" },
];

export const SATISFACTION_5: ResponseOption[] = [
  { value: 1, label: "Very unsatisfied" },
  { value: 2, label: "Somewhat unsatisfied" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat satisfied" },
  { value: 5, label: "Very satisfied" },
];

// ============================================
// SKIN & APPEARANCE SCALES
// ============================================

export const HYDRATION_5: ResponseOption[] = [
  { value: 1, label: "Very dry" },
  { value: 2, label: "Somewhat dry" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat hydrated" },
  { value: 5, label: "Very hydrated" },
];

// ============================================
// GUT HEALTH SCALES
// ============================================

export const REGULARITY_5: ResponseOption[] = [
  { value: 1, label: "Very irregular" },
  { value: 2, label: "Somewhat irregular" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat regular" },
  { value: 5, label: "Very regular" },
];

export const BLOATED_AFTER_MEAL_5: ResponseOption[] = [
  { value: 5, label: "Never" },
  { value: 4, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 2, label: "Often" },
  { value: 1, label: "After every meal" },
];

// ============================================
// IMMUNITY SCALES
// ============================================

export const SICK_DAYS_5: ResponseOption[] = [
  { value: 5, label: "0 days" },
  { value: 4, label: "1-2 days" },
  { value: 3, label: "3-5 days" },
  { value: 2, label: "6-10 days" },
  { value: 1, label: "More than 10 days" },
];

export const RESILIENCE_5: ResponseOption[] = [
  { value: 1, label: "Very weak" },
  { value: 2, label: "Somewhat weak" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat strong" },
  { value: 5, label: "Very strong" },
];

export const CATCH_ILLNESS_5: ResponseOption[] = [
  { value: 1, label: "Much more often" },
  { value: 2, label: "Somewhat more often" },
  { value: 3, label: "About the same" },
  { value: 4, label: "Somewhat less often" },
  { value: 5, label: "Much less often" },
];

// ============================================
// HAIR HEALTH SCALES
// ============================================

export const SHEDDING_5: ResponseOption[] = [
  { value: 5, label: "No shedding" },
  { value: 4, label: "Minimal shedding (normal)" },
  { value: 3, label: "Moderate shedding" },
  { value: 2, label: "Heavy shedding" },
  { value: 1, label: "Severe shedding" },
];

export const THICKNESS_5: ResponseOption[] = [
  { value: 1, label: "Very thin" },
  { value: 2, label: "Somewhat thin" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat thick" },
  { value: 5, label: "Very thick" },
];

export const SHINE_5: ResponseOption[] = [
  { value: 1, label: "Very dull" },
  { value: 2, label: "Somewhat dull" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat shiny" },
  { value: 5, label: "Very shiny" },
];

export const STRENGTH_5: ResponseOption[] = [
  { value: 1, label: "Very weak" },
  { value: 2, label: "Somewhat weak" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat strong" },
  { value: 5, label: "Very strong" },
];

// ============================================
// WEIGHT & METABOLISM SCALES
// ============================================

export const APPETITE_CONTROL_5: ResponseOption[] = [
  { value: 1, label: "Very poor (constant cravings)" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent (complete control)" },
];

export const METABOLISM_ENERGY_5: ResponseOption[] = [
  { value: 1, label: "Very sluggish" },
  { value: 2, label: "Somewhat sluggish" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat energetic" },
  { value: 5, label: "Very energetic" },
];

// ============================================
// NUMERIC SCALES
// ============================================

/** 0-10 scale for pain rating */
export const PAIN_SCALE_11: ResponseOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i === 0 ? "0 - No pain" : i === 10 ? "10 - Pain as bad as you can imagine" : String(i),
}));

/** 0-10 scale for interference rating */
export const INTERFERENCE_SCALE_11: ResponseOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i === 0 ? "0 - Does not interfere" : i === 10 ? "10 - Completely interferes" : String(i),
}));

/** 1-10 general rating scale */
export const SCALE_10: ResponseOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));
