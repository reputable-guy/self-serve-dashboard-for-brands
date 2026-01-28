"use client";

/**
 * Early Insights Store v2
 *
 * Zustand store for computing participant insights with progressive disclosure.
 * Shows value from n=1, emerging patterns at n=3, full aggregates at n=10.
 *
 * NOTE: Computation logic has been extracted to src/lib/insights/
 */

import { create } from 'zustand';
import type { EarlyInsightsData } from './types';
import { useEnrollmentStore } from './enrollment-store';
import {
  enrollmentsToCards,
  generateTimelineEvents,
  computeEmergingPatterns,
  aggregateBaselineQuestions,
  aggregateDemographics,
  aggregateBaselineScores,
  collectNotableQuotes,
} from './insights';

// Progressive disclosure thresholds
export const SHOW_INDIVIDUAL_FROM = 1;   // Show individual cards
export const SHOW_PATTERNS_FROM = 3;     // Show emerging patterns
export const SHOW_AGGREGATES_FROM = 10;  // Show full aggregates
export const SHOW_QUOTES_FROM = 15;      // Show notable quotes carousel
export const SHOW_DETAILED_FROM = 25;    // Full detailed breakdowns

// Legacy exports for backward compatibility
export const MINIMUM_PARTICIPANTS = SHOW_AGGREGATES_FROM;
export const QUOTES_THRESHOLD = SHOW_QUOTES_FROM;
export const DETAILED_THRESHOLD = SHOW_DETAILED_FROM;

interface EarlyInsightsStore {
  insightsCache: Record<string, EarlyInsightsData | null>;
  computeInsights: (studyId: string, categoryLabel?: string) => EarlyInsightsData | null;
  hasEnoughData: (studyId: string) => boolean;
  getBaselineCount: (studyId: string) => number;
  clearCache: (studyId?: string) => void;

  // Progressive disclosure methods
  hasAnyParticipants: (studyId: string) => boolean;
  hasEnoughForPatterns: (studyId: string) => boolean;
  hasEnoughForAggregates: (studyId: string) => boolean;
}

export const useEarlyInsightsStore = create<EarlyInsightsStore>()((set) => ({
  insightsCache: {},

  computeInsights: (studyId: string, categoryLabel?: string) => {
    const enrollments = useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId);

    // Return null only if zero participants
    if (enrollments.length === 0) {
      return null;
    }

    // Generate participant cards (always, from n=1)
    const participantCards = enrollmentsToCards(enrollments);

    // Generate timeline events
    const timeline = generateTimelineEvents(enrollments);

    // Compute emerging patterns (n >= 3)
    const emergingPatterns = computeEmergingPatterns(enrollments);

    // Compute aggregates (always compute, but UI decides when to show)
    const baselineQuestions = aggregateBaselineQuestions(enrollments);
    const demographics = aggregateDemographics(enrollments);
    const baselineScores = aggregateBaselineScores(enrollments, categoryLabel);

    // Collect notable quotes
    const notableQuotes = collectNotableQuotes(enrollments);

    const insights: EarlyInsightsData = {
      studyId,
      totalParticipants: useEnrollmentStore.getState().getEnrollmentsByStudy(studyId).length,
      participantsWithBaseline: enrollments.length,
      minimumRequired: SHOW_AGGREGATES_FROM,
      updatedAt: new Date().toISOString(),
      baselineQuestions,
      demographics,
      baselineScores,
      participantCards,
      timeline,
      emergingPatterns: emergingPatterns || undefined,
      notableQuotes,
    };

    // Cache the result
    set((state) => ({
      insightsCache: {
        ...state.insightsCache,
        [studyId]: insights,
      },
    }));

    return insights;
  },

  // Legacy method - now returns true if n >= 10
  hasEnoughData: (studyId: string) => {
    const enrollments = useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId);
    return enrollments.length >= SHOW_AGGREGATES_FROM;
  },

  getBaselineCount: (studyId: string) => {
    return useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId).length;
  },

  clearCache: (studyId?: string) => {
    if (studyId) {
      set((state) => ({
        insightsCache: {
          ...state.insightsCache,
          [studyId]: null,
        },
      }));
    } else {
      set({ insightsCache: {} });
    }
  },

  // Progressive disclosure methods
  hasAnyParticipants: (studyId: string) => {
    const count = useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId).length;
    return count >= SHOW_INDIVIDUAL_FROM;
  },

  hasEnoughForPatterns: (studyId: string) => {
    const count = useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId).length;
    return count >= SHOW_PATTERNS_FROM;
  },

  hasEnoughForAggregates: (studyId: string) => {
    const count = useEnrollmentStore.getState().getEnrollmentsWithBaseline(studyId).length;
    return count >= SHOW_AGGREGATES_FROM;
  },
}));
