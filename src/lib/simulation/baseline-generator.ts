/**
 * Baseline Data Generator
 *
 * SINGLE SOURCE OF TRUTH for generating participant baseline data.
 * All simulation paths must use this module to ensure consistency.
 */

import type {
  BaselineData,
  ParticipantArchetype,
  HeroSymptom,
  PainStory,
  HopedOutcomes,
} from '../types';
import {
  ARCHETYPE_DATA,
  selectArchetype,
  getArchetypeConfig,
  getArchetypeScoreModifier,
} from './archetypes';
import {
  getCategoryContent,
  getArchetypeQuotesForCategory,
  getHopedOutcomesForCategory,
  WELLNESS_GOALS,
  LIFE_STAGES,
  LIFE_STAGE_WEIGHTS,
  AGE_RANGES,
  AGE_WEIGHTS,
  VILLAIN_DURATIONS,
  TRIED_OTHER_OPTIONS,
  US_STATES,
} from './category-content';
import { generateWearableBaselineData } from './wearable-generator';

/**
 * Helper to pick random item from array
 */
function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Helper to pick random item with weights
 */
function weightedRandom<T>(items: readonly T[], weights: readonly number[]): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Random number in range [min, max]
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface GenerateBaselineOptions {
  /** Study category (sleep, stress, energy, etc.) */
  category?: string;
  /** Specific archetype to use (optional - will be randomly selected if not provided) */
  archetype?: ParticipantArchetype;
  /** Participant first name (for personalization, optional) */
  firstName?: string;
}

/**
 * Generate complete baseline data for a participant.
 *
 * This is the SINGLE function that should be used to generate baseline data.
 * It ensures all fields are populated consistently, including:
 * - Profile data (age, location, life stage)
 * - Baseline responses (motivation, duration, etc.)
 * - Assessment scores
 * - Hero symptom and pain story
 * - Hoped outcomes
 * - Wearable baseline data (for Tier 1-2 categories)
 */
export function generateBaselineData(options: GenerateBaselineOptions = {}): BaselineData {
  const { category, firstName } = options;
  const cat = category || 'default';

  // Select or use provided archetype
  const archetype = options.archetype || selectArchetype();
  const archetypeConfig = getArchetypeConfig(archetype);

  // Get category-specific content
  const content = getCategoryContent(cat);

  // Generate pain duration based on archetype
  const painDuration = pickRandom(archetypeConfig.painDurations);

  // Generate baseline question responses
  const baselineResponses = [
    {
      questionId: 'motivation',
      response: pickRandom(content.motivations),
    },
    {
      questionId: 'hoped-results',
      response: pickRandom(content.hopedResults),
    },
    {
      questionId: 'villain-duration',
      response: painDuration,
    },
    {
      questionId: 'tried-other',
      response: weightedRandom(TRIED_OTHER_OPTIONS, [0.4, 0.35, 0.25]),
    },
  ];

  // Generate profile data
  const profileData = {
    ageRange: weightedRandom(AGE_RANGES, AGE_WEIGHTS),
    lifeStage: weightedRandom(LIFE_STAGES, LIFE_STAGE_WEIGHTS),
    primaryWellnessGoal: pickRandom(WELLNESS_GOALS),
    baselineStressLevel: randomInRange(4, 7),
    location: pickRandom(US_STATES),
  };

  // Generate hero symptom
  const heroSymptom: HeroSymptom = {
    question: content.heroSymptoms.question,
    response: pickRandom(content.heroSymptoms.responses),
    severity: randomInRange(
      archetypeConfig.heroSymptomSeverity[0],
      archetypeConfig.heroSymptomSeverity[1]
    ),
  };

  // Generate failed alternatives
  const numFailedAlts = randomInRange(
    archetypeConfig.failedAlternativeCounts[0],
    archetypeConfig.failedAlternativeCounts[1]
  );
  const shuffledAlts = [...content.failedAlternatives].sort(() => Math.random() - 0.5);
  const failedAlternatives = shuffledAlts.slice(0, numFailedAlts);

  // Generate pain story - use CATEGORY-SPECIFIC quotes, not generic archetypes
  const categoryArchetypeQuotes = getArchetypeQuotesForCategory(cat, archetype);
  const painStory: PainStory = {
    duration: painDuration,
    failedAlternatives,
    desperationLevel: randomInRange(
      archetypeConfig.desperationLevel[0],
      archetypeConfig.desperationLevel[1]
    ),
    commitmentLevel: randomInRange(
      archetypeConfig.commitmentLevel[0],
      archetypeConfig.commitmentLevel[1]
    ),
    verbatimQuote: pickRandom(categoryArchetypeQuotes),
  };

  // Generate hoped outcomes - use CATEGORY-SPECIFIC outcomes
  const categoryHopedOutcomes = getHopedOutcomesForCategory(cat);
  const hopedOutcomes: HopedOutcomes = {
    primaryGoal: pickRandom(categoryHopedOutcomes),
    secondaryGoals: [pickRandom(content.hopedResults)],
    timeframe: pickRandom(archetypeConfig.timeframes),
  };

  // Generate assessment scores - archetype influences baseline
  const scoreModifier = getArchetypeScoreModifier(archetype);
  const baseComposite = Math.max(20, Math.min(80, 50 + scoreModifier + randomInRange(-10, 10)));

  const assessmentData = {
    compositeScore: baseComposite,
    primaryScore: baseComposite + randomInRange(-10, 5),
    primaryRaw: Math.floor(baseComposite / 10),
  };

  // Generate wearable baseline data (only for Tier 1-2 categories)
  const wearableBaseline = generateWearableBaselineData(cat, archetype);

  return {
    baselineResponses,
    profileData,
    assessmentData,
    completedAt: new Date().toISOString(),
    // Voyeuristic fields
    heroSymptom,
    painStory,
    hopedOutcomes,
    archetype,
    // Wearable baseline data (Tier 1-2 only)
    wearableBaseline,
  };
}

// Re-export for convenience
export { selectArchetype } from './archetypes';
