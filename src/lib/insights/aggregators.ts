/**
 * Aggregators
 *
 * Functions for aggregating enrollment data into demographics,
 * baseline scores, and question summaries.
 */

import type {
  BaselineQuestionAggregation,
  EarlyInsightsDemographics,
  BaselineScoreDistribution,
  EarlyInsightsData,
} from '../types';
import type { Enrollment } from '../enrollment-store';

// Question metadata for aggregation
const QUESTION_META: Record<string, { text: string; type: "text" | "voice_and_text" | "multiple_choice" }> = {
  'motivation': { text: 'What motivated you to try this product?', type: 'voice_and_text' },
  'hoped-results': { text: 'What results are you hoping to see?', type: 'voice_and_text' },
  'villain-duration': { text: 'How long have you been dealing with this?', type: 'multiple_choice' },
  'tried-other': { text: 'Have you tried other products for this?', type: 'multiple_choice' },
};

/**
 * Aggregate baseline question responses into distributions
 */
export function aggregateBaselineQuestions(enrollments: Enrollment[]): BaselineQuestionAggregation[] {
  const questionMap: Record<string, {
    questionId: string;
    questionType: "text" | "voice_and_text" | "multiple_choice";
    responses: Record<string, number>;
    quotes: { quote: string; participantInitials: string }[];
    total: number;
  }> = {};

  for (const enrollment of enrollments) {
    if (!enrollment.baselineData?.baselineResponses) continue;

    const initials = enrollment.name
      ? enrollment.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'AN';

    for (const response of enrollment.baselineData.baselineResponses) {
      const meta = QUESTION_META[response.questionId];
      if (!meta) continue;

      if (!questionMap[response.questionId]) {
        questionMap[response.questionId] = {
          questionId: response.questionId,
          questionType: meta.type,
          responses: {},
          quotes: [],
          total: 0,
        };
      }

      const q = questionMap[response.questionId];
      q.total++;

      if (meta.type === 'voice_and_text' || meta.type === 'text') {
        if (q.quotes.length < 10) {
          q.quotes.push({ quote: response.response, participantInitials: initials });
        }
        const theme = response.response.length > 50
          ? response.response.substring(0, 50) + '...'
          : response.response;
        q.responses[theme] = (q.responses[theme] || 0) + 1;
      } else {
        q.responses[response.response] = (q.responses[response.response] || 0) + 1;
      }
    }
  }

  return Object.entries(questionMap).map(([questionId, data]) => {
    const meta = QUESTION_META[questionId];
    const sortedResponses = Object.entries(data.responses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / data.total) * 100),
      }));

    return {
      questionId,
      questionText: meta.text,
      questionType: data.questionType,
      responses: sortedResponses,
      notableQuotes: data.quotes.slice(0, 5),
      totalResponses: data.total,
    };
  });
}

/**
 * Aggregate demographics from profile data
 */
export function aggregateDemographics(enrollments: Enrollment[]): EarlyInsightsDemographics {
  const ageMap: Record<string, number> = {};
  const lifeStageMap: Record<string, number> = {};
  const goalMap: Record<string, number> = {};
  const stressMap: Record<number, number> = {};
  let totalWithProfile = 0;

  for (const enrollment of enrollments) {
    const profile = enrollment.baselineData?.profileData;
    if (!profile) continue;
    totalWithProfile++;

    if (profile.ageRange) {
      ageMap[profile.ageRange] = (ageMap[profile.ageRange] || 0) + 1;
    }
    if (profile.lifeStage) {
      lifeStageMap[profile.lifeStage] = (lifeStageMap[profile.lifeStage] || 0) + 1;
    }
    if (profile.primaryWellnessGoal) {
      goalMap[profile.primaryWellnessGoal] = (goalMap[profile.primaryWellnessGoal] || 0) + 1;
    }
    if (profile.baselineStressLevel !== undefined) {
      stressMap[profile.baselineStressLevel] = (stressMap[profile.baselineStressLevel] || 0) + 1;
    }
  }

  type DistributionType =
    | { range: string; count: number; percentage: number }[]
    | { stage: string; count: number; percentage: number }[]
    | { goal: string; count: number; percentage: number }[];

  const toDistribution = (map: Record<string, number>, label: 'range' | 'stage' | 'goal'): DistributionType => {
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        [label]: key,
        count,
        percentage: totalWithProfile > 0 ? Math.round((count / totalWithProfile) * 100) : 0,
      })) as DistributionType;
  };

  return {
    ageRanges: toDistribution(ageMap, 'range') as EarlyInsightsDemographics['ageRanges'],
    lifeStages: toDistribution(lifeStageMap, 'stage') as EarlyInsightsDemographics['lifeStages'],
    primaryGoals: toDistribution(goalMap, 'goal') as EarlyInsightsDemographics['primaryGoals'],
    baselineStressDistribution: Object.entries(stressMap)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([level, count]) => ({
        level: Number(level),
        count,
        percentage: totalWithProfile > 0 ? Math.round((count / totalWithProfile) * 100) : 0,
      })),
  };
}

/**
 * Aggregate baseline assessment scores
 */
export function aggregateBaselineScores(
  enrollments: Enrollment[],
  categoryLabel?: string
): BaselineScoreDistribution | undefined {
  const scores: number[] = [];
  let primarySum = 0;
  let primaryCount = 0;

  for (const enrollment of enrollments) {
    const assessment = enrollment.baselineData?.assessmentData;
    if (!assessment) continue;

    scores.push(assessment.compositeScore);
    if (assessment.primaryRaw !== undefined) {
      primarySum += assessment.primaryRaw;
      primaryCount++;
    }
  }

  if (scores.length === 0) return undefined;

  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const buckets = [
    { range: '0-24 (Poor)', min: 0, max: 24, count: 0 },
    { range: '25-49 (Fair)', min: 25, max: 49, count: 0 },
    { range: '50-74 (Good)', min: 50, max: 74, count: 0 },
    { range: '75-100 (Excellent)', min: 75, max: 100, count: 0 },
  ];

  for (const score of scores) {
    for (const bucket of buckets) {
      if (score >= bucket.min && score <= bucket.max) {
        bucket.count++;
        break;
      }
    }
  }

  return {
    assessmentName: categoryLabel ? `${categoryLabel} Assessment` : 'Baseline Assessment',
    categoryLabel: categoryLabel || 'General',
    averageScore: avgScore,
    scoreDistribution: buckets.map(b => ({
      range: b.range,
      count: b.count,
      percentage: Math.round((b.count / scores.length) * 100),
    })),
    primaryQuestionSummary: primaryCount > 0 ? {
      questionText: 'Primary symptom rating',
      averageRaw: Math.round((primarySum / primaryCount) * 10) / 10,
      maxValue: 10,
    } : undefined,
  };
}

/**
 * Collect notable quotes for carousel
 */
export function collectNotableQuotes(enrollments: Enrollment[]): EarlyInsightsData['notableQuotes'] {
  const quotes: EarlyInsightsData['notableQuotes'] = [];

  for (const enrollment of enrollments) {
    const bd = enrollment.baselineData;
    if (!bd || !enrollment.name) continue;

    const initials = enrollment.name.split(' ').map(n => n[0]).join('').toUpperCase();

    // Add verbatim quote from pain story
    if (bd.painStory?.verbatimQuote) {
      quotes.push({
        quote: bd.painStory.verbatimQuote,
        initials,
        context: "Why they decided to try your product",
        archetype: bd.archetype,
      });
    }

    // Add hero symptom as quote
    if (bd.heroSymptom?.response && quotes.length < 15) {
      quotes.push({
        quote: bd.heroSymptom.response,
        initials,
        context: "Their challenge before starting",
        archetype: bd.archetype,
      });
    }
  }

  // Shuffle and limit
  return quotes.sort(() => Math.random() - 0.5).slice(0, 10);
}
