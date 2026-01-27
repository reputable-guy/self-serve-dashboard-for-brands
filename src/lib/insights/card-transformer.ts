/**
 * Card Transformer
 *
 * Transforms enrollment data into participant insight cards for display.
 */

import type { ParticipantInsightCard } from '../types';
import type { Enrollment } from '../enrollment-store';

/**
 * Generate a relative time string (e.g., "just now", "12 min ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

/**
 * Generate avatar color from name for consistency
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B",
    "#EF4444", "#EC4899", "#6366F1", "#14B8A6",
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Convert enrollment to participant insight card
 */
export function enrollmentToCard(enrollment: Enrollment): ParticipantInsightCard | null {
  if (!enrollment.baselineData || !enrollment.name) return null;

  const { baselineData } = enrollment;
  const nameParts = enrollment.name.split(' ');
  const firstName = nameParts[0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  const displayName = `${firstName} ${lastInitial}.`;
  const initials = `${firstName[0]}${lastInitial}`.toUpperCase();

  // Get hero symptom - prefer new field, fall back to motivation
  const heroSymptom = baselineData.heroSymptom?.response ||
    baselineData.baselineResponses?.find(r => r.questionId === 'motivation')?.response ||
    "Looking to improve my wellness";

  const heroSymptomSeverity = baselineData.heroSymptom?.severity || 5;

  // Get pain duration
  const painDuration = baselineData.painStory?.duration ||
    baselineData.baselineResponses?.find(r => r.questionId === 'villain-duration')?.response ||
    "Unknown";

  // Get failed alternatives
  const failedAlternatives = baselineData.painStory?.failedAlternatives || [];

  // Get desperation level
  const desperationLevel = baselineData.painStory?.desperationLevel || 5;

  // Get primary goal
  const primaryGoal = baselineData.hopedOutcomes?.primaryGoal ||
    baselineData.baselineResponses?.find(r => r.questionId === 'hoped-results')?.response ||
    "Feel better";

  // Get verbatim quote
  const verbatimQuote = baselineData.painStory?.verbatimQuote;

  // Get enrollment time
  const enrolledAt = enrollment.signedUpAt || enrollment.clickedAt;
  const enrolledAgo = getRelativeTime(enrolledAt);

  return {
    id: enrollment.id,
    displayName,
    initials,
    avatarColor: getAvatarColor(enrollment.name),
    enrolledAt,
    enrolledAgo,
    heroSymptom,
    heroSymptomSeverity,
    painDuration,
    failedAlternatives,
    desperationLevel,
    primaryGoal,
    verbatimQuote,
    ageRange: baselineData.profileData?.ageRange || "Unknown",
    location: baselineData.profileData?.location,
    baselineScore: baselineData.assessmentData?.compositeScore,
    archetype: baselineData.archetype,
    // Include wearable baseline data (Tier 1-2 categories only)
    wearableBaseline: baselineData.wearableBaseline,
  };
}

/**
 * Transform multiple enrollments to cards, sorted by most recent first
 */
export function enrollmentsToCards(enrollments: Enrollment[]): ParticipantInsightCard[] {
  return enrollments
    .map(e => enrollmentToCard(e))
    .filter((card): card is ParticipantInsightCard => card !== null)
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
}
