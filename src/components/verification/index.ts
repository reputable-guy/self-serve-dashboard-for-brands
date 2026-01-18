/**
 * Verification Components
 *
 * Split from the original 1500+ line verification-page.tsx into focused modules.
 */

// Badges and seals
export { ReputableSeal, InlineVerifiedBadge, TierBadge, VerificationBadge } from "./badges";

// Metrics display
export { MetricCard, AssessmentResultCard } from "./metrics";

// Journey and progress components
export { TimelineEvent, TestimonialResponsesSection, VillainJourneyProgress } from "./journey";

// Trust stack components
export { TrustStackPillar, ComparisonTable, HowWeVerifySection } from "./trust-stack";

// Main verification page
export { VerificationPage } from "./verification-page";
