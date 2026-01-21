/**
 * CATEGORIES - Single Source of Truth
 *
 * This file is THE authoritative definition for all category-related configuration.
 * Do NOT define categories elsewhere. Import from here.
 *
 * When adding a new category:
 * 1. Add to CATEGORIES array below
 * 2. That's it. Everything else derives from this.
 */

import type { TierLevel, CategoryDefinition } from "./types";

// Re-export CategoryValue from types for backwards compatibility
export type { CategoryValue } from "./types";

/**
 * Master category definitions with all metadata.
 * This is the ONLY place categories are defined.
 */
export const CATEGORIES: CategoryDefinition[] = [
  // ================================================
  // TIER 1: Wearables PRIMARY (sleep, recovery, fitness)
  // ================================================
  {
    value: "sleep",
    label: "Sleep",
    tier: 1,
    villainVariable: "sleep quality",
    assessment: {
      metricLabel: "sleep quality",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "sleep",
      primaryField: "sleepChange",
      secondaryField: "deepSleepChange",
      displayLabels: { primary: "Total Sleep", secondary: "Deep Sleep" },
    },
  },
  {
    value: "recovery",
    label: "Recovery",
    tier: 1,
    villainVariable: "recovery time",
    assessment: {
      metricLabel: "recovery score",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "hrv",
      primaryField: "hrvChange",
      secondaryField: "sleepChange",
      displayLabels: { primary: "HRV", secondary: "Sleep Quality" },
    },
  },
  {
    value: "fitness",
    label: "Fitness & Activity",
    tier: 1,
    villainVariable: "fitness performance",
    assessment: {
      metricLabel: "fitness level",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "activity",
      primaryField: "stepsChange",
      secondaryField: "activeMinutesChange",
      displayLabels: { primary: "Daily Steps", secondary: "Active Minutes" },
    },
  },

  // ================================================
  // TIER 2: Co-Primary (wearables + assessment equally weighted)
  // ================================================
  {
    value: "stress",
    label: "Stress",
    tier: 2,
    villainVariable: "stress levels",
    assessment: {
      metricLabel: "stress level",
      higherIsBetter: false, // Lower stress is better
      defaultRange: { baselineRaw: 7, endpointRaw: 3, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "hrv",
      primaryField: "hrvChange",
      secondaryField: "sleepChange",
      displayLabels: { primary: "HRV", secondary: "Total Sleep" },
    },
  },

  // ================================================
  // TIER 3: Assessment PRIMARY (wearables validate)
  // ================================================
  {
    value: "energy",
    label: "Energy & Vitality",
    tier: 3,
    villainVariable: "energy levels",
    assessment: {
      metricLabel: "energy level",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "activity",
      primaryField: "stepsChange",
      secondaryField: "activeMinutesChange",
      displayLabels: { primary: "Daily Steps", secondary: "Active Minutes" },
    },
  },
  {
    value: "focus",
    label: "Focus & Cognition",
    tier: 3,
    villainVariable: "focus and concentration",
    assessment: {
      metricLabel: "focus duration",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "activity",
      primaryField: "stepsChange",
      secondaryField: "activeMinutesChange",
      displayLabels: { primary: "Daily Steps", secondary: "Active Minutes" },
    },
  },
  {
    value: "mood",
    label: "Mood",
    tier: 3,
    villainVariable: "mood stability",
    assessment: {
      metricLabel: "mood score",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "hrv",
      primaryField: "hrvChange",
      secondaryField: "sleepChange",
      displayLabels: { primary: "HRV", secondary: "Sleep Quality" },
    },
  },
  {
    value: "anxiety",
    label: "Anxiety",
    tier: 3,
    villainVariable: "anxiety symptoms",
    assessment: {
      metricLabel: "anxiety level",
      higherIsBetter: false, // Lower anxiety is better
      defaultRange: { baselineRaw: 8, endpointRaw: 3, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "hrv",
      primaryField: "hrvChange",
      // No secondary field - anxiety only shows HRV
      displayLabels: { primary: "HRV" },
    },
  },
  {
    value: "pain",
    label: "Pain & Comfort",
    tier: 3,
    villainVariable: "pain levels",
    assessment: {
      metricLabel: "pain level",
      higherIsBetter: false, // Lower pain is better
      defaultRange: { baselineRaw: 7, endpointRaw: 3, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "sleep",
      primaryField: "sleepChange",
      secondaryField: "hrvChange",
      displayLabels: { primary: "Sleep Quality", secondary: "HRV" },
    },
  },
  {
    value: "resilience",
    label: "Mental Resilience",
    tier: 3,
    villainVariable: "mental resilience",
    assessment: {
      metricLabel: "resilience score",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: {
      supported: true,
      metricType: "hrv",
      primaryField: "hrvChange",
      secondaryField: "sleepChange",
      displayLabels: { primary: "HRV", secondary: "Recovery Sleep" },
    },
  },

  // ================================================
  // TIER 4: Assessment ONLY (no wearable validation)
  // ================================================
  {
    value: "skin",
    label: "Skin & Beauty",
    tier: 4,
    villainVariable: "skin clarity",
    assessment: {
      metricLabel: "skin clarity",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "gut",
    label: "Gut & Digestion",
    tier: 4,
    villainVariable: "digestive comfort",
    assessment: {
      metricLabel: "gut health",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 3, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "immunity",
    label: "Immunity",
    tier: 4,
    villainVariable: "immune resilience",
    assessment: {
      metricLabel: "immune resilience",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 5, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "hair",
    label: "Hair",
    tier: 4,
    villainVariable: "hair health",
    assessment: {
      metricLabel: "hair health",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 7, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "weight",
    label: "Weight & Metabolism",
    tier: 4,
    villainVariable: "appetite control",
    assessment: {
      metricLabel: "appetite control",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 3, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "libido",
    label: "Sexual Wellness",
    tier: 4,
    villainVariable: "sexual wellness",
    assessment: {
      metricLabel: "sexual wellness",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 4, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
  {
    value: "satiety",
    label: "Satiety & Fullness",
    tier: 4,
    villainVariable: "satiety after meals",
    assessment: {
      metricLabel: "satiety",
      higherIsBetter: true,
      defaultRange: { baselineRaw: 3, endpointRaw: 8, maxRaw: 10 },
    },
    wearables: { supported: false, metricType: "none" },
  },
];

// ============================================
// DERIVED HELPERS (don't duplicate, derive!)
// ============================================

/** Get category by value */
export function getCategory(value: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.value === value);
}

/** Get category label by value */
export function getCategoryLabel(value: string): string {
  return getCategory(value)?.label ?? value;
}

/** Get categories by tier */
export function getCategoriesByTier(tier: TierLevel): CategoryDefinition[] {
  return CATEGORIES.filter((c) => c.tier === tier);
}

/** Get tier 1 categories (wearables primary) */
export function getTier1Categories(): CategoryDefinition[] {
  return getCategoriesByTier(1);
}

/** Get tier 2 categories (co-primary) */
export function getTier2Categories(): CategoryDefinition[] {
  return getCategoriesByTier(2);
}

/** Get tier 3 categories (assessment primary) */
export function getTier3Categories(): CategoryDefinition[] {
  return getCategoriesByTier(3);
}

/** Get tier 4 categories (assessment only) */
export function getTier4Categories(): CategoryDefinition[] {
  return getCategoriesByTier(4);
}

/** Get categories that support wearables */
export function getWearableCategories(): CategoryDefinition[] {
  return CATEGORIES.filter((c) => c.wearables.supported);
}

/** Get assessment-only categories */
export function getAssessmentOnlyCategories(): CategoryDefinition[] {
  return CATEGORIES.filter((c) => !c.wearables.supported);
}

/** Check if category supports wearables */
export function categorySupportsWearables(value: string): boolean {
  return getCategory(value)?.wearables.supported ?? false;
}

/** Check if higher is better for this category */
export function isHigherBetter(value: string): boolean {
  return getCategory(value)?.assessment.higherIsBetter ?? true;
}

/** Get wearable display labels for category */
export function getWearableLabels(value: string): { primary: string; secondary?: string } | null {
  const cat = getCategory(value);
  if (!cat?.wearables.supported) return null;
  return cat.wearables.displayLabels ?? null;
}

/** Check if wearable data should be shown for category + tier combination */
export function shouldShowWearableData(category: string, tier: number): boolean {
  if (tier === 4) return false;
  return categorySupportsWearables(category);
}

// ============================================
// BACKWARDS COMPATIBILITY EXPORTS
// ============================================

/** Simple label lookup (backwards compatible with CATEGORY_LABELS) */
export const CATEGORY_LABELS: Record<string, string> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.value] = cat.label;
    return acc;
  },
  {} as Record<string, string>
);

/** Legacy format: array with {value, label, tier} */
export const CATEGORIES_LEGACY = CATEGORIES.map((c) => ({
  value: c.value,
  label: c.label,
  tier: c.tier as TierLevel,
}));

// Add legacy mappings for old category values
Object.assign(CATEGORY_LABELS, {
  Sleep: "Sleep",
  Stress: "Stress",
  Energy: "Energy & Vitality",
  Recovery: "Recovery",
  Fitness: "Fitness & Activity",
  Nutrition: "Gut & Digestion",
  Skin: "Skin & Beauty",
  nutrition: "Gut & Digestion",
  longevity: "Energy & Vitality",
  cognitive: "Focus & Cognition",
});
