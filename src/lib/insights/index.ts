/**
 * Insights Module
 *
 * All utilities for computing and transforming participant insights.
 */

// Card transformation
export {
  getRelativeTime,
  getAvatarColor,
  enrollmentToCard,
  enrollmentsToCards,
} from './card-transformer';

// Timeline generation
export {
  extractQuoteSnippets,
  generateTimelineEvents,
} from './timeline-generator';

// Pattern detection
export {
  PATTERNS_THRESHOLD,
  RELIABLE_THRESHOLD,
  computeEmergingPatterns,
  hasReliablePatterns,
} from './pattern-detector';

// Aggregation
export {
  aggregateBaselineQuestions,
  aggregateDemographics,
  aggregateBaselineScores,
  collectNotableQuotes,
} from './aggregators';
