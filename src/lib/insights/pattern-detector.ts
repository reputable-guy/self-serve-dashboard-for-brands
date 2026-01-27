/**
 * Pattern Detector
 *
 * Computes emerging patterns from enrollment data.
 * Shows early signals of common pain points, failed alternatives, etc.
 */

import type { EmergingPatterns } from '../types';
import type { Enrollment } from '../enrollment-store';

// Minimum participants needed to show patterns
export const PATTERNS_THRESHOLD = 3;
export const RELIABLE_THRESHOLD = 10;

/**
 * Compute emerging patterns from enrollments
 */
export function computeEmergingPatterns(enrollments: Enrollment[]): EmergingPatterns | null {
  if (enrollments.length < PATTERNS_THRESHOLD) return null;

  // Aggregate pain points (from hero symptoms)
  const painPointCounts: Record<string, number> = {};
  const failedAltCounts: Record<string, number> = {};
  let totalDesperation = 0;
  let desperationCount = 0;
  const durationCounts: Record<string, number> = {};

  for (const enrollment of enrollments) {
    const bd = enrollment.baselineData;
    if (!bd) continue;

    // Count hero symptoms / pain points
    const heroResponse = bd.heroSymptom?.response ||
      bd.baselineResponses?.find(r => r.questionId === 'motivation')?.response;
    if (heroResponse) {
      // Use first 50 chars as theme key
      const theme = heroResponse.length > 50 ? heroResponse.substring(0, 50) + '...' : heroResponse;
      painPointCounts[theme] = (painPointCounts[theme] || 0) + 1;
    }

    // Count failed alternatives
    const failedAlts = bd.painStory?.failedAlternatives || [];
    for (const alt of failedAlts) {
      failedAltCounts[alt] = (failedAltCounts[alt] || 0) + 1;
    }

    // Sum desperation levels
    if (bd.painStory?.desperationLevel) {
      totalDesperation += bd.painStory.desperationLevel;
      desperationCount++;
    }

    // Count durations
    const duration = bd.painStory?.duration ||
      bd.baselineResponses?.find(r => r.questionId === 'villain-duration')?.response;
    if (duration) {
      durationCounts[duration] = (durationCounts[duration] || 0) + 1;
    }
  }

  // Convert to sorted arrays
  const topPainPoints = Object.entries(painPointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / enrollments.length) * 100),
    }));

  const commonFailedAlternatives = Object.entries(failedAltCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));

  const mostCommonDuration = Object.entries(durationCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

  const averageDesperationLevel = desperationCount > 0
    ? Math.round((totalDesperation / desperationCount) * 10) / 10
    : 5;

  const confidenceNote = enrollments.length < RELIABLE_THRESHOLD
    ? `Based on ${enrollments.length} participants. Patterns become more reliable at ${RELIABLE_THRESHOLD}+.`
    : `Based on ${enrollments.length} participants - statistically reliable.`;

  return {
    topPainPoints,
    commonFailedAlternatives,
    averageDesperationLevel,
    mostCommonDuration,
    confidenceNote,
  };
}

/**
 * Check if we have enough data for reliable patterns
 */
export function hasReliablePatterns(enrollmentCount: number): boolean {
  return enrollmentCount >= RELIABLE_THRESHOLD;
}
