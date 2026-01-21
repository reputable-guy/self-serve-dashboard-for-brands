// LYFEfuel Daily Essentials - Demo Verified Stories
// These stories demonstrate the type of verified evidence LYFEfuel can expect from Reputable
// Aligned with their marketing claims:
// - "Energizes Naturally: steady, crash-free vitality"
// - "Keeps You Satisfied: full for hours, no cravings"
// - "Supports Metabolism: helps reach weight goals"
// - "Without the bloat, bad taste, or supplement clutter"

import { ParticipantStory } from "./types";
import { TierLevel } from "./assessments";
import {
  createAssessmentResult,
  BrandStudyStats,
  getStoriesForStudy,
  getStudyStats,
} from "./generators/story-utils";

// ============================================
// LYFEFUEL ENERGY STUDY - SAMPLE STORIES
// Focus: "Energizes Naturally: steady, crash-free vitality"
// ============================================

export const LYFEFUEL_ENERGY_STORIES: ParticipantStory[] = [
  {
    id: "lyfefuel-energy-1",
    name: "Michael T.",
    initials: "MT",
    tier: 3 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "Busy professional with demanding schedule",
      primaryWellnessGoal: "Eliminate afternoon energy crashes",
      baselineStressLevel: 6,
    },
    baseline: {
      motivation: "I was hitting a wall every afternoon around 2pm. My productivity tanked, I was reaching for coffee and snacks constantly, and it was affecting my work performance.",
      hopedResults: "I wanted steady energy throughout the day without relying on caffeine or sugar for a quick fix.",
      villainDuration: "1+ years",
      triedOther: "Yes, several energy supplements and pre-workouts",
    },
    journey: {
      startDate: "2024-10-01",
      endDate: "2024-10-29",
      durationDays: 28,
      villainVariable: "afternoon energy crash",
      villainRatings: [
        { day: 1, rating: 2, note: "Same old 2pm crash. Needed two cups of coffee to get through the afternoon." },
        { day: 7, rating: 3, note: "Energy feels slightly more stable. Only reached for coffee once." },
        { day: 14, rating: 4, note: "Powered through a long meeting at 3pm without feeling foggy." },
        { day: 21, rating: 4, note: "Consistently good energy. Skipped my afternoon coffee entirely." },
        { day: 28, rating: 5, note: "Night and day difference. Energy is steady from morning to evening." },
      ],
      keyQuotes: [
        { day: 14, quote: "I actually went for a walk after work instead of crashing on the couch. That's new.", context: "Week 2 check-in" },
        { day: 28, quote: "My 3pm slump is gone. I'm getting more done after lunch than I used to get done all afternoon.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-energy",
      "Reputable Energy Assessment",
      "Energy & Vitality",
      35, // baseline composite
      78, // endpoint composite
      4,  // baseline raw (energy level 4/10)
      8,  // endpoint raw (energy level 8/10)
      10
    ),
    // Tier 3: Activity-related wearable metrics as supporting evidence
    wearableMetrics: {
      device: "Apple Watch",
      sleepChange: { before: 0, after: 0, unit: "min", changePercent: 0 }, // Required field but not used
      stepsChange: { before: 4500, after: 6800, unit: "steps", changePercent: 51 },
      activeMinutesChange: { before: 25, after: 45, unit: "min", changePercent: 80 },
    },
    verified: true,
    verificationId: "LYFE-ENERGY-001",
    completedAt: "2024-10-29",
    overallRating: 4.8,
  },
  {
    id: "lyfefuel-energy-2",
    name: "Jennifer K.",
    initials: "JK",
    tier: 3 as TierLevel,
    profile: {
      ageRange: "45-54",
      lifeStage: "Working parent juggling career and family",
      primaryWellnessGoal: "Have energy for family after work",
      baselineStressLevel: 7,
    },
    baseline: {
      motivation: "By the time I got home from work, I was completely drained. I felt guilty that I didn't have energy for my kids or to exercise.",
      hopedResults: "I wanted to feel present and energetic for my family, not just surviving until bedtime.",
      villainDuration: "6-12 months",
      triedOther: "Yes, tried B vitamins and energy drinks",
    },
    journey: {
      startDate: "2024-10-01",
      endDate: "2024-10-29",
      durationDays: 28,
      villainVariable: "evening fatigue",
      villainRatings: [
        { day: 1, rating: 2, note: "Crashed on the couch as soon as I got home. Kids played without me." },
        { day: 7, rating: 2, note: "Slightly more alert after work. Actually played with the kids briefly." },
        { day: 14, rating: 3, note: "Had energy to help with homework and cook dinner. Small win." },
        { day: 21, rating: 4, note: "Went for a family walk after dinner. Haven't done that in months." },
        { day: 28, rating: 5, note: "I have energy for evening activities. My kids noticed!" },
      ],
      keyQuotes: [
        { day: 21, quote: "My daughter said 'Mommy has energy again!' That hit different.", context: "Week 3 check-in" },
        { day: 28, quote: "I'm not just surviving until bedtime anymore. I'm actually present for my family.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-energy",
      "Reputable Energy Assessment",
      "Energy & Vitality",
      32, // baseline composite
      75, // endpoint composite
      3,  // baseline raw (energy level 3/10)
      8,  // endpoint raw (energy level 8/10)
      10
    ),
    // Tier 3: Activity-related wearable metrics as supporting evidence
    wearableMetrics: {
      device: "Fitbit",
      sleepChange: { before: 0, after: 0, unit: "min", changePercent: 0 }, // Required field but not used
      stepsChange: { before: 3800, after: 5700, unit: "steps", changePercent: 50 },
      activeMinutesChange: { before: 20, after: 38, unit: "min", changePercent: 90 },
    },
    verified: true,
    verificationId: "LYFE-ENERGY-002",
    completedAt: "2024-10-29",
    overallRating: 4.9,
  },
  {
    id: "lyfefuel-energy-3",
    name: "Alex R.",
    initials: "AR",
    tier: 3 as TierLevel,
    profile: {
      ageRange: "25-34",
      lifeStage: "Remote worker with irregular schedule",
      primaryWellnessGoal: "Consistent energy without caffeine dependency",
      baselineStressLevel: 5,
    },
    baseline: {
      motivation: "I was drinking 4-5 cups of coffee a day and still feeling tired. The caffeine was messing with my sleep, creating a vicious cycle.",
      hopedResults: "I wanted natural energy that didn't require constant caffeine hits.",
      villainDuration: "1+ years",
      triedOther: "Yes, tried cutting coffee but felt worse",
    },
    journey: {
      startDate: "2024-10-01",
      endDate: "2024-10-29",
      durationDays: 28,
      villainVariable: "caffeine dependency",
      villainRatings: [
        { day: 1, rating: 2, note: "Still drinking 4 cups of coffee to function" },
        { day: 7, rating: 3, note: "Down to 2 cups and feeling okay. Less jittery." },
        { day: 14, rating: 4, note: "One morning coffee is enough. No afternoon crashes." },
        { day: 21, rating: 4, note: "Energy feels cleaner. More sustained, less spikey." },
        { day: 28, rating: 5, note: "One cup of coffee by choice, not necessity. Energy is stable all day." },
      ],
      keyQuotes: [
        { day: 14, quote: "I stopped reaching for my afternoon coffee without even thinking about it.", context: "Week 2 check-in" },
        { day: 28, quote: "The energy is different - steady and clean, not the jittery ups and downs of caffeine.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-energy",
      "Reputable Energy Assessment",
      "Energy & Vitality",
      40, // baseline composite
      82, // endpoint composite
      4,  // baseline raw (energy level 4/10)
      9,  // endpoint raw (energy level 9/10)
      10
    ),
    // Tier 3: Activity-related wearable metrics as supporting evidence
    wearableMetrics: {
      device: "Garmin",
      sleepChange: { before: 0, after: 0, unit: "min", changePercent: 0 }, // Required field but not used
      stepsChange: { before: 5200, after: 7500, unit: "steps", changePercent: 44 },
      activeMinutesChange: { before: 30, after: 52, unit: "min", changePercent: 73 },
    },
    verified: true,
    verificationId: "LYFE-ENERGY-003",
    completedAt: "2024-10-29",
    overallRating: 4.7,
  },
];

// ============================================
// LYFEFUEL SATIETY STUDY - SAMPLE STORIES
// Focus: "Keeps You Satisfied: full for hours, no cravings"
// ============================================

export const LYFEFUEL_SATIETY_STORIES: ParticipantStory[] = [
  {
    id: "lyfefuel-satiety-1",
    name: "Sarah M.",
    initials: "SM",
    tier: 4 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "Busy professional trying to eat healthy",
      primaryWellnessGoal: "Control afternoon snacking and cravings",
      baselineStressLevel: 6,
    },
    baseline: {
      motivation: "I'd eat a healthy breakfast but be starving by 10am. Then the afternoon cravings would hit and I'd raid the office snack drawer. It felt out of control.",
      hopedResults: "I wanted to feel satisfied after meals and not constantly think about food.",
      villainDuration: "1+ years",
      triedOther: "Yes, tried protein bars and meal replacement shakes",
    },
    journey: {
      startDate: "2024-11-15",
      endDate: "2024-12-13",
      durationDays: 28,
      villainVariable: "constant cravings",
      villainRatings: [
        { day: 1, rating: 2, note: "Usual pattern - hungry by 10am, cravings by 3pm" },
        { day: 7, rating: 3, note: "Made it to lunch without snacking. That's unusual." },
        { day: 14, rating: 4, note: "Walked past the office candy without thinking about it." },
        { day: 21, rating: 4, note: "Feel satisfied with normal portions. Less food noise in my head." },
        { day: 28, rating: 5, note: "I eat when I'm hungry, not out of craving. Huge difference." },
      ],
      keyQuotes: [
        { day: 14, quote: "I walked past the break room snacks without even registering them. My brain has changed.", context: "Week 2 check-in" },
        { day: 28, quote: "For the first time in years, I feel in control of my appetite rather than controlled by it.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-weight",
      "Reputable Weight & Metabolism Assessment",
      "Appetite Control",
      30, // baseline composite
      78, // endpoint composite
      3,  // baseline raw (appetite control 3/10)
      8,  // endpoint raw (appetite control 8/10)
      10
    ),
    verified: true,
    verificationId: "LYFE-SATIETY-001",
    completedAt: "2024-12-13",
    overallRating: 4.8,
  },
  {
    id: "lyfefuel-satiety-2",
    name: "David L.",
    initials: "DL",
    tier: 4 as TierLevel,
    profile: {
      ageRange: "45-54",
      lifeStage: "Health-conscious professional managing weight",
      primaryWellnessGoal: "Support metabolism and reduce hunger",
      baselineStressLevel: 5,
    },
    baseline: {
      motivation: "I was eating less but still feeling hungry. The calorie restriction wasn't sustainable because I was constantly thinking about food.",
      hopedResults: "I wanted to feel satisfied on normal portions and support my metabolism naturally.",
      villainDuration: "6-12 months",
      triedOther: "Yes, tried various diet approaches",
    },
    journey: {
      startDate: "2024-11-15",
      endDate: "2024-12-13",
      durationDays: 28,
      villainVariable: "persistent hunger",
      villainRatings: [
        { day: 1, rating: 2, note: "Always hungry between meals. Willpower fatigue is real." },
        { day: 7, rating: 3, note: "Less urgent hunger. More of a gentle signal than a demand." },
        { day: 14, rating: 4, note: "Three meals a day feels adequate. No more grazing." },
        { day: 21, rating: 4, note: "Portions feel right. Not overeating because I'm not under-satisfied." },
        { day: 28, rating: 5, note: "Hunger and fullness signals actually work now. Revolutionary." },
      ],
      keyQuotes: [
        { day: 21, quote: "I stopped eating because I was full, not because I ran out of food. That's new.", context: "Week 3 check-in" },
        { day: 28, quote: "My relationship with food has fundamentally changed. I'm not fighting hunger anymore.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-weight",
      "Reputable Weight & Metabolism Assessment",
      "Appetite Control",
      35, // baseline composite
      80, // endpoint composite
      3,  // baseline raw (satisfaction 3/10)
      9,  // endpoint raw (satisfaction 9/10)
      10
    ),
    verified: true,
    verificationId: "LYFE-SATIETY-002",
    completedAt: "2024-12-13",
    overallRating: 4.7,
  },
];

// ============================================
// LYFEFUEL DIGESTIVE COMFORT STUDY - SAMPLE STORIES
// Focus: "Without the bloat, bad taste, or supplement clutter"
// ============================================

export const LYFEFUEL_GUT_STORIES: ParticipantStory[] = [
  {
    id: "lyfefuel-gut-1",
    name: "Rachel P.",
    initials: "RP",
    tier: 4 as TierLevel,
    profile: {
      ageRange: "25-34",
      lifeStage: "Health-conscious professional with sensitive stomach",
      primaryWellnessGoal: "Find a protein shake that doesn't cause bloating",
      baselineStressLevel: 4,
    },
    baseline: {
      motivation: "Every protein shake I've tried leaves me bloated and uncomfortable. I'd given up on finding one that worked for my sensitive stomach.",
      hopedResults: "I just wanted a protein shake I could drink without paying for it later with digestive distress.",
      villainDuration: "1+ years",
      triedOther: "Yes, tried multiple protein powders, even 'sensitive stomach' formulas",
    },
    journey: {
      startDate: "2024-11-20",
      endDate: "2024-12-18",
      durationDays: 28,
      villainVariable: "protein shake bloating",
      villainRatings: [
        { day: 1, rating: 3, note: "First shake - braced for bloating. Surprisingly... nothing." },
        { day: 7, rating: 4, note: "A full week of shakes, zero bloating. Is this real?" },
        { day: 14, rating: 4, note: "My digestion actually feels better, not just not-worse." },
        { day: 21, rating: 5, note: "This is the protein shake I've been searching for." },
        { day: 28, rating: 5, note: "Complete digestion comfort. No bloating, ever." },
      ],
      keyQuotes: [
        { day: 7, quote: "I actually forgot to brace for the bloat because it never came. Shocking.", context: "Week 1 check-in" },
        { day: 28, quote: "I finally found a protein shake that doesn't hate my stomach. This is huge for me.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-gut",
      "Reputable Gut Health Assessment",
      "Digestive Comfort",
      40, // baseline composite
      88, // endpoint composite
      4,  // baseline raw (gut comfort 4/10)
      9,  // endpoint raw (gut comfort 9/10)
      10
    ),
    verified: true,
    verificationId: "LYFE-GUT-001",
    completedAt: "2024-12-18",
    overallRating: 4.9,
  },
  {
    id: "lyfefuel-gut-2",
    name: "Chris B.",
    initials: "CB",
    tier: 4 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "Fitness enthusiast tired of supplement issues",
      primaryWellnessGoal: "Clean nutrition without digestive side effects",
      baselineStressLevel: 5,
    },
    baseline: {
      motivation: "I was taking 5 different supplements and my gut was a mess. Bloating, gas, irregularity. I needed to simplify without sacrificing nutrition.",
      hopedResults: "One simple product that replaces my supplement stack without the digestive chaos.",
      villainDuration: "6-12 months",
      triedOther: "Yes, various supplement combinations",
    },
    journey: {
      startDate: "2024-11-20",
      endDate: "2024-12-18",
      durationDays: 28,
      villainVariable: "supplement-induced bloating",
      villainRatings: [
        { day: 1, rating: 3, note: "Replaced my morning supplements with one shake. Gut already happier." },
        { day: 7, rating: 4, note: "Bloating is down 80%. Less gas. More regularity." },
        { day: 14, rating: 4, note: "My stomach is calmer than it's been in months." },
        { day: 21, rating: 5, note: "Digestion is smooth. No more planning my day around bloating." },
        { day: 28, rating: 5, note: "Simplified my routine AND improved my digestion. Win-win." },
      ],
      keyQuotes: [
        { day: 14, quote: "I wore my fitted jeans all day without discomfort. Couldn't do that before.", context: "Week 2 check-in" },
        { day: 28, quote: "One product replaced five and my gut is happier. This is what clean nutrition should be.", context: "Final reflection" },
      ],
    },
    assessmentResult: createAssessmentResult(
      "reputable-gut",
      "Reputable Gut Health Assessment",
      "Digestive Comfort",
      35, // baseline composite
      82, // endpoint composite
      3,  // baseline raw (gut comfort 3/10)
      9,  // endpoint raw (gut comfort 9/10)
      10
    ),
    verified: true,
    verificationId: "LYFE-GUT-002",
    completedAt: "2024-12-18",
    overallRating: 4.8,
  },
];

// ============================================
// AGGREGATE DATA FOR DISPLAY
// ============================================

// Re-export BrandStudyStats as LYFEfuelStudyStats for backwards compatibility
export type LYFEfuelStudyStats = BrandStudyStats;

export const LYFEFUEL_STUDY_STATS: LYFEfuelStudyStats[] = [
  {
    studyId: "study-lyfefuel-energy",
    studyName: "Daily Essentials Energy Study",
    category: "energy",
    participants: 52,
    completionRate: 84,
    averageImprovement: 95, // Average improvement percentage in energy scores
    topHeadline: "84% of participants reported elimination of afternoon energy crashes",
    stories: LYFEFUEL_ENERGY_STORIES,
  },
  {
    studyId: "study-lyfefuel-satiety",
    studyName: "Daily Essentials Satiety Study",
    category: "weight",
    participants: 38,
    completionRate: 80,
    averageImprovement: 112, // Average improvement in appetite control
    topHeadline: "92% of participants reported reduced cravings and better appetite control",
    stories: LYFEFUEL_SATIETY_STORIES,
  },
  {
    studyId: "study-lyfefuel-gut",
    studyName: "Daily Essentials Digestive Comfort Study",
    category: "gut",
    participants: 25,
    completionRate: 88,
    averageImprovement: 125, // Average improvement in gut comfort
    topHeadline: "96% of participants reported no bloating - compared to previous protein shakes",
    stories: LYFEFUEL_GUT_STORIES,
  },
];

// Combined array of all LYFEfuel stories for easy lookup
export const ALL_LYFEFUEL_STORIES: ParticipantStory[] = [
  ...LYFEFUEL_ENERGY_STORIES,
  ...LYFEFUEL_SATIETY_STORIES,
  ...LYFEFUEL_GUT_STORIES,
];

// Get all LYFEfuel stories
export function getAllLYFEfuelStories(): ParticipantStory[] {
  return ALL_LYFEFUEL_STORIES;
}

// Get stories for a specific LYFEfuel study
export function getLYFEfuelStoriesForStudy(studyId: string): ParticipantStory[] {
  return getStoriesForStudy(LYFEFUEL_STUDY_STATS, studyId);
}

// Get study stats for LYFEfuel
export function getLYFEfuelStudyStats(studyId: string): LYFEfuelStudyStats | undefined {
  return getStudyStats(LYFEFUEL_STUDY_STATS, studyId);
}
