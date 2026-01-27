/**
 * Timeline Generator
 *
 * Generates timeline events from enrollments for the live activity feed.
 */

import type { InsightTimelineEvent } from '../types';
import type { Enrollment } from '../enrollment-store';
import { getRelativeTime } from './card-transformer';

/**
 * Distinctive phrases to look for in customer responses.
 * These represent common symptoms/challenges customers describe.
 */
const DISTINCTIVE_PHRASES = [
  // Sleep patterns
  "racing thoughts", "can't fall asleep", "wake up at 3am", "waking up at 3am",
  "wake up exhausted", "light sleep", "never hit deep sleep", "dependent on sleep aids",
  "tossing and turning", "mind races", "can't stay asleep",
  // Stress patterns
  "work pressure", "can't stop worrying", "shoulders and jaw", "mind never stops",
  "anxiety spikes", "feel on edge", "racing mind", "constant stress",
  // Energy patterns
  "afternoon crash", "2-3pm crash", "exhausted from the moment", "need caffeine",
  "nothing left for my family", "brain fog", "tired all the time",
  // Focus patterns
  "can't concentrate", "mind wanders", "can't finish", "re-read the same",
  "making mistakes", "simple decisions feel overwhelming",
  // Recovery patterns
  "sore for days", "takes longer", "HRV is consistently low", "feel depleted",
  "performance is declining",
];

/**
 * Extract distinctive short phrases from hero symptom responses.
 * Finds common phrases that appear across multiple customers.
 */
export function extractQuoteSnippets(responses: string[]): Map<string, string[]> {
  const phraseMap = new Map<string, string[]>();

  for (const response of responses) {
    const lowerResponse = response.toLowerCase();

    // Check for each distinctive phrase
    for (const phrase of DISTINCTIVE_PHRASES) {
      if (lowerResponse.includes(phrase.toLowerCase())) {
        if (!phraseMap.has(phrase)) {
          phraseMap.set(phrase, []);
        }
        phraseMap.get(phrase)!.push(response);
        break; // Only count one phrase per response
      }
    }
  }

  return phraseMap;
}

/**
 * Generate timeline events from enrollments
 */
export function generateTimelineEvents(enrollments: Enrollment[]): InsightTimelineEvent[] {
  const events: InsightTimelineEvent[] = [];

  // Sort enrollments by signup time (most recent first)
  const sorted = [...enrollments].sort((a, b) => {
    const aTime = new Date(a.signedUpAt || a.clickedAt).getTime();
    const bTime = new Date(b.signedUpAt || b.clickedAt).getTime();
    return bTime - aTime;
  });

  // Create enrollment events
  for (const enrollment of sorted) {
    if (!enrollment.name) continue;

    const nameParts = enrollment.name.split(' ');
    const initials = `${nameParts[0][0]}${nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''}`.toUpperCase();
    const timestamp = enrollment.signedUpAt || enrollment.clickedAt;

    // Get context from baseline data for a more engaging event
    const painDuration = enrollment.baselineData?.painStory?.duration;
    const desperationLevel = enrollment.baselineData?.painStory?.desperationLevel;
    const heroSymptom = enrollment.baselineData?.heroSymptom?.response;

    // Build engaging content based on available data
    let content = "joined the study";
    if (painDuration && desperationLevel && desperationLevel >= 7) {
      content = `joined after ${painDuration} of struggling`;
    } else if (painDuration) {
      content = `signed up after ${painDuration}`;
    }

    events.push({
      id: `event-${enrollment.id}`,
      type: 'new_participant',
      timestamp,
      timeAgo: getRelativeTime(timestamp),
      participantInitials: initials,
      content,
      metadata: desperationLevel ? { desperationLevel } : undefined,
    });

    // Add quote captured event with actual snippet from their story
    const quote = enrollment.baselineData?.painStory?.verbatimQuote || heroSymptom;
    if (quote) {
      // Extract a short compelling snippet (first phrase or sentence)
      const snippet = quote.length > 60
        ? quote.substring(0, 57).replace(/[,.]?\s+\S*$/, '') + '...'
        : quote;

      events.push({
        id: `quote-${enrollment.id}`,
        type: 'quote_captured',
        timestamp,
        timeAgo: getRelativeTime(timestamp),
        participantInitials: initials,
        content: `shared: "${snippet}"`,
      });
    }
  }

  // Add pattern events if enough participants
  if (enrollments.length >= 3) {
    // Collect hero symptom responses for pattern detection
    const heroResponses: string[] = [];
    for (const e of enrollments) {
      const heroSymptom = e.baselineData?.heroSymptom?.response ||
        e.baselineData?.baselineResponses?.find(r => r.questionId === 'motivation')?.response;
      if (heroSymptom) {
        heroResponses.push(heroSymptom);
      }
    }

    // Extract actual quote snippets
    const phraseMap = extractQuoteSnippets(heroResponses);

    // Find top phrase patterns (count >= 2)
    const topPhrases = Array.from(phraseMap.entries())
      .filter(([, responses]) => responses.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 2); // Top 2 patterns

    for (const [phrase, matchedResponses] of topPhrases) {
      const count = matchedResponses.length;
      const total = enrollments.length;
      const percentage = Math.round((count / total) * 100);

      events.push({
        id: `pattern-symptom-${phrase.replace(/\s+/g, '-')}`,
        type: 'pattern_emerging',
        timestamp: new Date().toISOString(),
        timeAgo: 'just now',
        content: `${count} of ${total} customers mention "${phrase}"`,
        metadata: {
          patternQuote: phrase,
          patternCount: count,
          patternTotal: total,
          pattern: `${percentage}% share this experience`,
        },
      });
    }

    // Also check for failed alternatives patterns
    const failedAltCounts: Record<string, number> = {};
    for (const e of enrollments) {
      const failedAlts = e.baselineData?.painStory?.failedAlternatives || [];
      for (const alt of failedAlts) {
        failedAltCounts[alt] = (failedAltCounts[alt] || 0) + 1;
      }
    }

    // Find top failed alternative (if 50%+ tried it)
    const topFailedAlt = Object.entries(failedAltCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (topFailedAlt && topFailedAlt[1] >= Math.ceil(enrollments.length / 2)) {
      const count = topFailedAlt[1];
      const total = enrollments.length;
      const percentage = Math.round((count / total) * 100);

      events.push({
        id: `pattern-alt-${topFailedAlt[0].replace(/\s+/g, '-')}`,
        type: 'pattern_emerging',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        timeAgo: '30 min ago',
        content: `${percentage}% previously tried "${topFailedAlt[0]}"`,
        metadata: {
          patternQuote: topFailedAlt[0],
          patternCount: count,
          patternTotal: total,
          pattern: `Common solution that didn't work for them`,
        },
      });
    }
  }

  // Sort all events by timestamp (most recent first)
  return events.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
