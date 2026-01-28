/**
 * Completed Story Generator
 *
 * Generates ParticipantStory objects from completed enrollments for display
 * in the Results tab. Creates realistic 28-day journeys with improvement metrics,
 * verification links, and a mix of outcomes.
 */

import type { ParticipantStory, TierLevel } from '../types';
import type { Enrollment } from '../enrollment-store';
import { createAssessmentResult } from '../generators/story-utils';

// Outcome types for realistic mix
export type OutcomeType = 'improved' | 'mixed' | 'no_improvement';

// Outcome distribution (60% improved, 25% mixed, 15% no improvement)
const OUTCOME_WEIGHTS: { type: OutcomeType; weight: number }[] = [
  { type: 'improved', weight: 0.60 },
  { type: 'mixed', weight: 0.25 },
  { type: 'no_improvement', weight: 0.15 },
];

// Category to assessment mapping
const CATEGORY_ASSESSMENTS: Record<string, { id: string; name: string; label: string; higherIsBetter: boolean }> = {
  sleep: { id: 'reputable-sleep', name: 'Reputable Sleep Assessment', label: 'Sleep Quality', higherIsBetter: true },
  stress: { id: 'reputable-stress', name: 'Reputable Stress Assessment', label: 'Stress Management', higherIsBetter: false },
  energy: { id: 'reputable-energy', name: 'Reputable Energy Assessment', label: 'Energy & Vitality', higherIsBetter: true },
  focus: { id: 'reputable-focus', name: 'Reputable Focus Assessment', label: 'Mental Clarity', higherIsBetter: true },
  recovery: { id: 'reputable-recovery', name: 'Reputable Recovery Assessment', label: 'Recovery', higherIsBetter: true },
  mood: { id: 'reputable-mood', name: 'Reputable Mood Assessment', label: 'Mood', higherIsBetter: true },
  anxiety: { id: 'reputable-anxiety', name: 'Reputable Anxiety Assessment', label: 'Anxiety Relief', higherIsBetter: false },
  gut: { id: 'reputable-gut', name: 'Reputable Gut Health Assessment', label: 'Digestive Comfort', higherIsBetter: true },
  weight: { id: 'reputable-weight', name: 'Reputable Weight Assessment', label: 'Appetite Control', higherIsBetter: true },
  skin: { id: 'reputable-skin', name: 'Reputable Skin Health Assessment', label: 'Skin Appearance', higherIsBetter: true },
  hair: { id: 'reputable-hair', name: 'Reputable Hair Health Assessment', label: 'Hair Health', higherIsBetter: true },
  immunity: { id: 'reputable-immunity', name: 'Reputable Immunity Assessment', label: 'Immune Resilience', higherIsBetter: true },
  pain: { id: 'reputable-pain', name: 'Reputable Pain Assessment', label: 'Pain Level', higherIsBetter: false },
  fitness: { id: 'reputable-fitness', name: 'Reputable Fitness Assessment', label: 'Fitness Level', higherIsBetter: true },
};

// Category-specific villain variables and quotes (multiple options per day for variety)
const CATEGORY_CONTENT: Record<string, {
  villainVariables: string[];
  improvedQuotes: { day: number; quotes: string[]; context: string }[];
  mixedQuotes: { day: number; quotes: string[]; context: string }[];
  noImprovementQuotes: { day: number; quotes: string[]; context: string }[];
}> = {
  sleep: {
    villainVariables: ['poor sleep quality', 'trouble falling asleep', 'waking up tired', 'racing thoughts at bedtime', 'restless nights', 'waking up multiple times'],
    improvedQuotes: [
      { day: 14, quotes: [
        "I'm actually falling asleep within 15 minutes now. Used to take an hour.",
        "Finally sleeping through the night. Haven't done that in months!",
        "My partner says I'm not tossing and turning anymore.",
        "Waking up feeling refreshed for the first time in years.",
        "The racing thoughts at bedtime have really calmed down.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "My sleep score went from 65 to 85. I feel like a different person.",
        "28 days in and I'm getting the best sleep of my adult life.",
        "This completely transformed my sleep. Deep, restorative rest every night.",
        "I used to dread bedtime. Now I actually look forward to it.",
        "The change in my sleep quality has been dramatic. Worth every penny.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some nights are better, but it's still inconsistent.",
        "Falling asleep easier, but still waking up at 3am occasionally.",
        "Quality seems improved, but quantity is the same.",
        "Good nights mixed with some not-so-good ones.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "I sleep deeper but still wake up once or twice. It's an improvement though.",
        "Not a complete fix, but my sleep is noticeably better overall.",
        "The bad nights are less bad, and the good nights are more frequent.",
        "Modest improvement - maybe 30% better than before I started.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Honestly, not seeing much difference yet.",
        "Still struggling with the same sleep issues.",
        "Hoped for more by now, but sleep is about the same.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Sleep is about the same. Maybe I need a longer trial period.",
        "Unfortunately no real change in my sleep patterns.",
        "Didn't work for me, but everyone's different I guess.",
      ], context: "Final reflection" },
    ],
  },
  stress: {
    villainVariables: ['chronic work stress', 'anxiety', 'constant tension', 'overwhelm', 'racing mind', 'work-life imbalance'],
    improvedQuotes: [
      { day: 14, quotes: [
        "My colleagues say I seem calmer. I feel it too.",
        "Actually taking things in stride now instead of spiraling.",
        "The constant knot in my stomach has loosened up.",
        "Handling pressure at work so much better than before.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Stress levels down significantly. I actually enjoy work again.",
        "I've found a sense of calm I didn't know was possible.",
        "My family noticed the change before I did. Less reactive, more present.",
        "This gave me the tools to manage stress effectively. Life-changing.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Better at handling small stressors, but big ones still hit hard.",
        "Some improvement, but stress still gets to me more than I'd like.",
        "Good days and bad days. Progress isn't linear.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "It's helping but not a magic fix. Progress though.",
        "I'm better equipped to handle stress, even if it's still there.",
        "Not stress-free, but definitely stress-reduced.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still stressed, maybe even more so lately.",
        "Haven't noticed a change in my stress levels yet.",
        "Work is still overwhelming. Hoping for improvement.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "My stress levels haven't really changed.",
        "Unfortunately still feeling just as stressed as before.",
        "Didn't see the results I was hoping for with stress.",
      ], context: "Final reflection" },
    ],
  },
  energy: {
    villainVariables: ['afternoon energy crash', 'constant fatigue', 'low energy', 'exhaustion', 'brain fog', 'needing caffeine to function'],
    improvedQuotes: [
      { day: 14, quotes: [
        "No more 3pm crash! Actually powered through the whole day.",
        "Cut my coffee intake in half and still have more energy.",
        "Waking up ready to go instead of hitting snooze 5 times.",
        "My energy is so much more stable throughout the day.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Energy is steady all day. This is life-changing.",
        "I've got my mojo back. Feeling 10 years younger.",
        "From exhausted to energized. My whole life has shifted.",
        "The brain fog is gone and I have energy to spare.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Mornings are better but afternoons still drag.",
        "Some improvement in energy, but not consistent.",
        "Good energy days mixed with tired days.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "More energy overall, but not consistent every day.",
        "Noticed improvement, but still need that afternoon coffee.",
        "Better than before, but not the complete transformation I hoped for.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still hitting that wall in the afternoon.",
        "Energy levels haven't really budged.",
        "Still feeling fatigued most days.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Energy levels about the same as before.",
        "Unfortunately didn't see the energy boost I was hoping for.",
        "Still struggling with fatigue. May try something different.",
      ], context: "Final reflection" },
    ],
  },
  focus: {
    villainVariables: ['difficulty concentrating', 'brain fog', 'scattered thoughts', 'forgetfulness', 'mental fatigue', 'trouble focusing at work'],
    improvedQuotes: [
      { day: 14, quotes: [
        "My concentration has noticeably improved. Getting more done at work.",
        "The brain fog has lifted. Thoughts are clearer.",
        "Reading for longer periods without losing focus now.",
        "Colleagues noticed I'm more engaged in meetings.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Mental clarity is back. It's like a fog has lifted.",
        "Focus at work has improved dramatically. Much more productive.",
        "Can hold complex thoughts and follow through on tasks now.",
        "The scattered feeling is gone. Mind feels sharp again.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some improvement in focus, but still have off days.",
        "Mornings are clearer, afternoons still foggy.",
        "Better on some tasks, still struggle with others.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Focus is better overall, but not completely reliable.",
        "Some improvement, but still need strategies to stay on task.",
        "Partial improvement - good days are really good now.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still feeling scattered and unfocused.",
        "Brain fog persists. Hoping for a breakthrough.",
        "Concentration hasn't improved much yet.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Focus issues remain. May need to explore other options.",
        "Unfortunately my concentration hasn't improved.",
        "Still struggling with mental clarity.",
      ], context: "Final reflection" },
    ],
  },
  mood: {
    villainVariables: ['low mood', 'emotional ups and downs', 'feeling down', 'lack of joy', 'irritability', 'mood swings'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Finding myself smiling more. Mood has definitely lifted.",
        "The gray cloud feeling is starting to clear.",
        "Actually looking forward to things again.",
        "My family says I seem more like myself.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Mood has stabilized beautifully. Feeling like myself again.",
        "The emotional rollercoaster has calmed down. So grateful.",
        "Joy is easier to access now. Little things make me happy.",
        "This brought back a lightness I didn't know I was missing.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Good days and bad days. Not as low as before though.",
        "Some improvement in mood, but not consistent.",
        "Feeling a bit more stable emotionally.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Mood is better overall, with occasional dips.",
        "Not a complete transformation, but noticeably improved.",
        "More good days than before. Still working on it.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Mood feels about the same. Still hoping.",
        "Haven't noticed a change in how I feel emotionally.",
        "Still experiencing the same ups and downs.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Unfortunately mood hasn't shifted much.",
        "Still struggling with low moments.",
        "May need additional support beyond this.",
      ], context: "Final reflection" },
    ],
  },
  anxiety: {
    villainVariables: ['anxious thoughts', 'constant worry', 'racing heart', 'nervous energy', 'overthinking', 'feeling on edge'],
    improvedQuotes: [
      { day: 14, quotes: [
        "The anxious chatter in my head has quieted down.",
        "Actually able to relax without that underlying tension.",
        "Heart doesn't race at every little thing now.",
        "Worry spirals happen less frequently.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Anxiety levels are way down. Finally found some peace.",
        "The constant edge has softened. Life feels manageable.",
        "Racing thoughts have calmed. Can enjoy the present.",
        "This gave me tools to manage anxiety I didn't have before.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some relief, but anxiety still shows up.",
        "Better equipped to handle it, even if it's still there.",
        "Good moments of calm mixed with anxious patches.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Anxiety is reduced but not gone. Progress though.",
        "Not anxiety-free, but definitely more manageable.",
        "Peak anxiety moments are less intense now.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still feeling anxious most of the time.",
        "The worry and racing thoughts persist.",
        "Haven't found relief from anxiety yet.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Anxiety levels haven't changed much for me.",
        "Still struggling with worry and nervousness.",
        "May need to explore other approaches.",
      ], context: "Final reflection" },
    ],
  },
  recovery: {
    villainVariables: ['slow recovery', 'persistent soreness', 'feeling worn down', 'not bouncing back', 'post-workout fatigue', 'muscle stiffness'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Bouncing back from workouts faster. Less sore the next day.",
        "Recovery time has noticeably improved.",
        "Can train harder because I'm recovering better.",
        "Morning stiffness is much less than before.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Recovery is dramatically better. Ready for each workout.",
        "My body feels 10 years younger in terms of bounce-back.",
        "Can finally push myself without paying for it for days.",
        "This transformed my training by fixing my recovery.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some improvement in recovery, still not where I want to be.",
        "Good days and still-sore days.",
        "A bit faster recovery, but room for improvement.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Recovery is better but not revolutionary.",
        "Helping, but not the complete fix I hoped for.",
        "Incremental improvement in how I bounce back.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still feeling it for days after training.",
        "Recovery hasn't noticeably improved yet.",
        "Body still taking a long time to bounce back.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Recovery is about the same as before starting.",
        "Haven't seen the improvement I was hoping for.",
        "Still dealing with prolonged soreness.",
      ], context: "Final reflection" },
    ],
  },
  gut: {
    villainVariables: ['digestive discomfort', 'bloating', 'irregular digestion', 'stomach issues', 'gut problems', 'digestive sensitivity'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Bloating has really reduced. Stomach feels so much calmer.",
        "Digestion is more regular and comfortable now.",
        "Can eat without worrying about how I'll feel after.",
        "The constant discomfort has settled down.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Gut health is transformed. No more daily discomfort.",
        "Digestion runs smoothly now. Such a relief.",
        "The bloating and issues are basically gone.",
        "My gut finally feels balanced and happy.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some days are better, still have occasional flare-ups.",
        "Bloating is reduced but not gone.",
        "Gut feels calmer, but still sensitive to certain foods.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Gut issues are better but not fully resolved.",
        "Improvement in digestion, still have some off days.",
        "Progress, but my gut still acts up sometimes.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still dealing with the same digestive issues.",
        "Bloating and discomfort persist.",
        "Haven't noticed a change in my gut health yet.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Gut issues remain unchanged for me.",
        "Unfortunately no improvement in digestion.",
        "Still searching for something that helps my gut.",
      ], context: "Final reflection" },
    ],
  },
  weight: {
    villainVariables: ['appetite control issues', 'cravings', 'emotional eating', 'weight management struggles', 'metabolism concerns', 'portion control'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Cravings have really reduced. Feel more in control.",
        "Appetite is more balanced. Not constantly hungry.",
        "Actually feeling satisfied after meals now.",
        "The urge to snack has significantly decreased.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Appetite is completely under control. This is game-changing.",
        "Feel in charge of my eating for the first time in years.",
        "The constant hunger and cravings are gone.",
        "This helped me build a healthier relationship with food.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some reduction in cravings, but they still pop up.",
        "Appetite is a bit more stable. Not a dramatic change.",
        "Better on some days, still struggle on others.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Some help with appetite, but not a complete solution.",
        "Cravings are less intense, but still present.",
        "Modest improvement in appetite control.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Still dealing with the same cravings and appetite.",
        "Haven't noticed a change in hunger patterns.",
        "Appetite control remains challenging.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Appetite and cravings are the same as before.",
        "Unfortunately didn't help with my eating patterns.",
        "May need to try a different approach for appetite.",
      ], context: "Final reflection" },
    ],
  },
  skin: {
    villainVariables: ['skin concerns', 'dull complexion', 'skin texture issues', 'signs of aging', 'skin dryness', 'uneven skin tone'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Skin is looking more radiant. Friends are noticing.",
        "Complexion has evened out nicely.",
        "Skin feels smoother and more hydrated.",
        "The dullness is fading. See a natural glow now.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Skin transformation has been remarkable. Best it's looked in years.",
        "Complexion is clear, even, and glowing.",
        "The improvement in my skin has boosted my confidence.",
        "This did more for my skin than products costing 5x as much.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some improvement in skin texture. Hoping for more.",
        "Skin looks a bit brighter on some days.",
        "Minor improvements, but not dramatic yet.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Skin is somewhat improved. Not a complete transformation.",
        "Some areas look better, others still need work.",
        "Modest improvement in skin appearance.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Haven't noticed a change in my skin yet.",
        "Skin looks about the same as before.",
        "Still hoping to see skin improvements.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "No significant change in my skin appearance.",
        "Skin concerns remain unchanged.",
        "May need a different approach for my skin.",
      ], context: "Final reflection" },
    ],
  },
  default: {
    villainVariables: ['ongoing challenges', 'wellness concerns', 'health goals', 'quality of life issues'],
    improvedQuotes: [
      { day: 14, quotes: [
        "Definitely noticing improvements. Feeling better overall.",
        "Positive changes are starting to show.",
        "Things are moving in the right direction.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "This has made a real difference in my daily life.",
        "Very happy with the results. Would definitely recommend.",
        "Exceeded my expectations. Noticeable improvement.",
      ], context: "Final reflection" },
    ],
    mixedQuotes: [
      { day: 14, quotes: [
        "Some days are better than others.",
        "Seeing some small improvements.",
        "Progress is slow but happening.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Modest improvement. Not dramatic but noticeable.",
        "Some benefits, but room for more improvement.",
        "Helpful, but not a complete solution.",
      ], context: "Final reflection" },
    ],
    noImprovementQuotes: [
      { day: 14, quotes: [
        "Not seeing much change yet.",
        "Hoping for more progress soon.",
        "Results haven't materialized yet.",
      ], context: "Week 2 check-in" },
      { day: 28, quotes: [
        "Results haven't been what I hoped for.",
        "Unfortunately no significant change.",
        "May not be the right fit for me.",
      ], context: "Final reflection" },
    ],
  },
};

/**
 * Select an outcome type based on weights
 */
function selectOutcome(): OutcomeType {
  const random = Math.random();
  let cumulative = 0;
  for (const { type, weight } of OUTCOME_WEIGHTS) {
    cumulative += weight;
    if (random <= cumulative) return type;
  }
  return 'improved';
}

/**
 * Generate villain ratings for a 28-day journey based on outcome type
 */
function generateVillainRatings(outcome: OutcomeType): { day: number; rating: number; note?: string }[] {
  const baseRatings: Record<OutcomeType, number[]> = {
    improved: [2, 3, 4, 4, 5],       // Steady improvement
    mixed: [2, 3, 3, 4, 3],          // Some ups and downs
    no_improvement: [2, 2, 2, 3, 2], // Minimal change
  };

  const ratings = baseRatings[outcome];
  const notes: Record<OutcomeType, string[]> = {
    improved: [
      "Starting out, symptoms still present",
      "Beginning to notice some improvement",
      "Feeling noticeably better",
      "Consistent improvement, building momentum",
      "Major improvement, very satisfied",
    ],
    mixed: [
      "Symptoms as usual at baseline",
      "Some days better than others",
      "Not sure if seeing real change",
      "Had a good week, feeling hopeful",
      "Improvement isn't as consistent as I hoped",
    ],
    no_improvement: [
      "Recording my baseline experience",
      "About the same as last week",
      "Still waiting to feel a difference",
      "Slight variation but nothing significant",
      "Honestly, not seeing the results I expected",
    ],
  };

  return [1, 7, 14, 21, 28].map((day, i) => ({
    day,
    rating: ratings[i],
    note: notes[outcome][i],
  }));
}

/**
 * Get category tier (simplified mapping)
 */
function getCategoryTier(category: string): TierLevel {
  const tier1 = ['sleep', 'recovery', 'fitness'];
  const tier2 = ['stress'];
  const tier3 = ['energy', 'focus', 'mood', 'anxiety'];
  // Tier 4: gut, weight, skin, hair, immunity, etc.

  if (tier1.includes(category)) return 1;
  if (tier2.includes(category)) return 2;
  if (tier3.includes(category)) return 3;
  return 4;
}

/**
 * Generate wearable metrics based on category and outcome
 */
function generateWearableMetrics(category: string, outcome: OutcomeType, tier: TierLevel) {
  // Only Tier 1-2 have primary wearable metrics
  if (tier > 2) return undefined;

  const outcomeMultiplier: Record<OutcomeType, number> = {
    improved: 1,
    mixed: 0.4,
    no_improvement: 0,
  };
  const mult = outcomeMultiplier[outcome];

  const devices = ['Apple Watch Series 9', 'Oura Ring Gen 3', 'Whoop 4.0', 'Garmin Venu 3', 'Fitbit Sense 2'];
  const device = devices[Math.floor(Math.random() * devices.length)];

  if (category === 'sleep') {
    const baselineSleep = 330 + Math.floor(Math.random() * 40); // 330-370 min
    const sleepImprovement = Math.floor((20 + Math.random() * 30) * mult);
    const baselineDeep = 35 + Math.floor(Math.random() * 15); // 35-50 min
    const deepImprovement = Math.floor((15 + Math.random() * 25) * mult);
    const baselineHrv = 35 + Math.floor(Math.random() * 15); // 35-50 ms
    const hrvImprovement = Math.floor((10 + Math.random() * 15) * mult);

    return {
      device,
      sleepChange: {
        before: baselineSleep,
        after: baselineSleep + sleepImprovement,
        unit: 'min' as const,
        changePercent: Math.round((sleepImprovement / baselineSleep) * 100),
      },
      deepSleepChange: {
        before: baselineDeep,
        after: baselineDeep + deepImprovement,
        unit: 'min' as const,
        changePercent: Math.round((deepImprovement / baselineDeep) * 100),
      },
      hrvChange: {
        before: baselineHrv,
        after: baselineHrv + hrvImprovement,
        unit: 'ms' as const,
        changePercent: Math.round((hrvImprovement / baselineHrv) * 100),
      },
    };
  }

  if (category === 'stress') {
    const baselineHrv = 35 + Math.floor(Math.random() * 10); // Lower baseline for stressed
    const hrvImprovement = Math.floor((15 + Math.random() * 20) * mult);

    return {
      device,
      hrvChange: {
        before: baselineHrv,
        after: baselineHrv + hrvImprovement,
        unit: 'ms' as const,
        changePercent: Math.round((hrvImprovement / baselineHrv) * 100),
      },
    };
  }

  if (category === 'recovery') {
    const baselineHrv = 40 + Math.floor(Math.random() * 15);
    const hrvImprovement = Math.floor((12 + Math.random() * 18) * mult);
    const baselineSleep = 340 + Math.floor(Math.random() * 30);
    const sleepImprovement = Math.floor((15 + Math.random() * 25) * mult);

    return {
      device,
      sleepChange: {
        before: baselineSleep,
        after: baselineSleep + sleepImprovement,
        unit: 'min' as const,
        changePercent: Math.round((sleepImprovement / baselineSleep) * 100),
      },
      hrvChange: {
        before: baselineHrv,
        after: baselineHrv + hrvImprovement,
        unit: 'ms' as const,
        changePercent: Math.round((hrvImprovement / baselineHrv) * 100),
      },
    };
  }

  return undefined;
}

/**
 * Generate a verification ID for the participant
 */
function generateVerificationId(studyId: string, index: number): string {
  const studyPrefix = studyId.replace(/^study-/, '').replace(/-/g, '_').toUpperCase().slice(0, 8);
  return `${studyPrefix}-SIM-${String(index + 1).padStart(3, '0')}`;
}

/**
 * Transform a completed enrollment into a ParticipantStory
 */
export function enrollmentToCompletedStory(
  enrollment: Enrollment,
  category: string,
  index: number
): ParticipantStory | null {
  if (enrollment.stage !== 'completed' || !enrollment.name) return null;

  const baseline = enrollment.baselineData;
  const outcome = selectOutcome();
  const tier = getCategoryTier(category);

  // Get category content
  const content = CATEGORY_CONTENT[category] || CATEGORY_CONTENT.default;
  const assessment = CATEGORY_ASSESSMENTS[category] || CATEGORY_ASSESSMENTS.energy;

  // Parse name
  const nameParts = enrollment.name.split(' ');
  const firstName = nameParts[0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  const displayName = `${firstName} ${lastInitial}.`;
  const initials = `${firstName[0]}${lastInitial}`.toUpperCase();

  // Generate journey data
  const villainVariable = content.villainVariables[Math.floor(Math.random() * content.villainVariables.length)];
  const villainRatings = generateVillainRatings(outcome);

  // Select quotes based on outcome (randomly pick one from each day's options)
  const quoteOptionsForOutcome =
    outcome === 'improved' ? content.improvedQuotes :
    outcome === 'mixed' ? content.mixedQuotes :
    content.noImprovementQuotes;

  // Transform to single quotes by randomly selecting from arrays
  const keyQuotes = quoteOptionsForOutcome.map(({ day, quotes, context }) => ({
    day,
    quote: quotes[Math.floor(Math.random() * quotes.length)],
    context,
  }));

  // Generate assessment scores based on outcome
  const baselineScore = baseline?.assessmentData?.compositeScore || (40 + Math.floor(Math.random() * 20));
  let endpointScore: number;
  let baselineRaw: number;
  let endpointRaw: number;

  if (assessment.higherIsBetter) {
    // Higher is better (energy, focus, sleep, etc.)
    baselineRaw = Math.floor(baselineScore / 10);
    if (outcome === 'improved') {
      endpointScore = Math.min(95, Math.round(baselineScore * (1.15 + Math.random() * 0.25)));
      endpointRaw = Math.min(10, baselineRaw + 4 + Math.floor(Math.random() * 2));
    } else if (outcome === 'mixed') {
      endpointScore = Math.round(baselineScore * (1.0 + Math.random() * 0.12));
      endpointRaw = Math.min(10, baselineRaw + 1 + Math.floor(Math.random() * 2));
    } else {
      endpointScore = baselineScore + Math.floor(Math.random() * 5) - 2;
      endpointRaw = baselineRaw + Math.floor(Math.random() * 2) - 1;
    }
  } else {
    // Lower is better (stress, anxiety) — improvement means the score goes DOWN
    baselineRaw = Math.min(10, Math.max(1, 10 - Math.floor(baselineScore / 10)));
    if (outcome === 'improved') {
      endpointScore = Math.max(5, Math.round(baselineScore * (0.60 + Math.random() * 0.25)));
      endpointRaw = Math.max(1, baselineRaw - 4 - Math.floor(Math.random() * 2));
    } else if (outcome === 'mixed') {
      endpointScore = Math.max(5, Math.round(baselineScore * (0.88 + Math.random() * 0.12)));
      endpointRaw = Math.max(1, baselineRaw - 1 - Math.floor(Math.random() * 2));
    } else {
      endpointScore = baselineScore + Math.floor(Math.random() * 5) - 2;
      endpointRaw = baselineRaw + Math.floor(Math.random() * 2) - 1;
    }
  }

  // Calculate dates
  const completedDate = enrollment.completedAt
    ? new Date(enrollment.completedAt)
    : new Date();
  const startDate = new Date(completedDate.getTime() - 28 * 24 * 60 * 60 * 1000);

  return {
    id: `story-${enrollment.id}`,
    name: displayName,
    initials,
    tier,
    profile: {
      ageRange: baseline?.profileData?.ageRange || '35-44',
      lifeStage: baseline?.profileData?.lifeStage || 'Working professional',
      primaryWellnessGoal: baseline?.hopedOutcomes?.primaryGoal || `Improve ${category}`,
      location: baseline?.profileData?.location,
    },
    baseline: {
      motivation: baseline?.heroSymptom?.response || baseline?.baselineResponses?.find(r => r.questionId === 'motivation')?.response || "Looking to improve my wellness",
      hopedResults: baseline?.hopedOutcomes?.primaryGoal || "Feel better",
      villainDuration: baseline?.painStory?.duration || "6-12 months",
      triedOther: baseline?.painStory?.failedAlternatives?.join(', ') || "Yes, various options",
    },
    journey: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: completedDate.toISOString().split('T')[0],
      durationDays: 28,
      villainVariable,
      villainRatings,
      keyQuotes,
    },
    wearableMetrics: generateWearableMetrics(category, outcome, tier),
    assessmentResult: createAssessmentResult({
      assessmentId: assessment.id,
      assessmentName: assessment.name,
      categoryLabel: assessment.label,
      baselineComposite: baselineScore,
      endpointComposite: endpointScore,
      baselineRaw,
      endpointRaw,
      maxRaw: 10,
      higherIsBetter: assessment.higherIsBetter,
    }),
    verified: true,
    verificationId: generateVerificationId(enrollment.studyId, index),
    completedAt: completedDate.toISOString().split('T')[0],
    overallRating: outcome === 'improved' ? 4.5 + Math.random() * 0.5 :
                   outcome === 'mixed' ? 3 + Math.random() * 1 :
                   2 + Math.random() * 1,
  };
}

/**
 * Get completed stories for a study from enrollments
 */
export function getCompletedStoriesFromEnrollments(
  enrollments: Enrollment[],
  category: string
): ParticipantStory[] {
  return enrollments
    .filter(e => e.stage === 'completed')
    .map((e, i) => enrollmentToCompletedStory(e, category, i))
    .filter((story): story is ParticipantStory => story !== null);
}

/**
 * Categorize a story as positive, neutral, or negative based on improvement
 */
export function categorizeStory(story: ParticipantStory): 'positive' | 'neutral' | 'negative' {
  const finalRating = story.journey?.villainRatings?.[story.journey.villainRatings.length - 1]?.rating || 0;
  const overallRating = story.overallRating || story.finalTestimonial?.overallRating || 0;
  
  // For real data with wearable metrics, use HRV improvement
  const hrvChange = story.wearableMetrics?.hrvChange?.changePercent;
  if (hrvChange !== undefined && overallRating > 0) {
    if (hrvChange > 5 && overallRating >= 4) return 'positive';
    if (hrvChange < -5 && overallRating < 3) return 'negative';
    // Use overall rating as tiebreaker
    if (overallRating >= 4) return 'positive';
    if (overallRating < 3) return 'negative';
    return 'neutral';
  }

  // Simulated stories with villain ratings
  if (finalRating >= 4 && overallRating >= 4) return 'positive';
  if (finalRating <= 2 || overallRating < 3) return 'negative';
  if (overallRating >= 4) return 'positive';
  return 'neutral';
}
