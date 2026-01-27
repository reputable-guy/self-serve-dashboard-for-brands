/**
 * Simulation Module
 *
 * All utilities for generating simulated participant data.
 */

// Archetype definitions and selection
export {
  type ArchetypeConfig,
  ARCHETYPE_DATA,
  selectArchetype,
  getArchetypeConfig,
  getArchetypeScoreModifier,
} from './archetypes';

// Category-specific content
export {
  CATEGORY_MOTIVATIONS,
  CATEGORY_HOPED_RESULTS,
  CATEGORY_HERO_SYMPTOMS,
  CATEGORY_FAILED_ALTERNATIVES,
  WELLNESS_GOALS,
  LIFE_STAGES,
  LIFE_STAGE_WEIGHTS,
  AGE_RANGES,
  AGE_WEIGHTS,
  VILLAIN_DURATIONS,
  TRIED_OTHER_OPTIONS,
  US_STATES,
  FIRST_NAMES,
  LAST_NAMES,
  getCategoryContent,
  hasSpecificCategoryContent,
} from './category-content';

// Wearable data generation
export {
  categorySupportsWearables,
  generateWearableBaselineData,
} from './wearable-generator';

// Baseline data generation (SINGLE SOURCE OF TRUTH)
export {
  type GenerateBaselineOptions,
  generateBaselineData,
} from './baseline-generator';

// Completed story generation (for Results tab)
export {
  type OutcomeType,
  enrollmentToCompletedStory,
  getCompletedStoriesFromEnrollments,
  categorizeStory,
} from './completed-story-generator';
